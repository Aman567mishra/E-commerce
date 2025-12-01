// src/components/ProductCard.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

// --- Image URL helpers ---
const isLikelyImageFile = (url) =>
  /^data:image\/|^https?:\/\/.+\.(png|jpg|jpeg|gif|webp|avif)(\?|#|$)/i.test(url);

// Extract a Google Drive file ID from many URL shapes
const extractDriveId = (raw) => {
  if (!raw) return null;
  const url = String(raw).trim();

  // If it's already a direct image file, bail out
  if (isLikelyImageFile(url)) return null;

  // Quick rejects
  if (/photos\.app\.goo\.gl/i.test(url)) return null; // Google Photos page, not embeddable
  if (/drive\.google\.com\/drive\/(u\/\d\/)?folders\//i.test(url)) return null; // folder link

  // Try structured parsing
  try {
    const u = new URL(url);

    // /file/d/<id>/...
    const mPath = u.pathname.match(/\/file\/d\/([^/]+)/);
    if (mPath) return mPath[1];

    // /uc?id=<id> or /open?id=<id>
    if ((/\/uc$/i.test(u.pathname) || /\/open$/i.test(u.pathname)) && u.searchParams.get("id")) {
      return u.searchParams.get("id");
    }

    // ?id=<id>
    const qid = u.searchParams.get("id");
    if (qid) return qid;

    // Some shared links carry resourcekey; id is still present in path sometimes
    const mAny = u.href.match(/[-\w]{25,}/);
    if (mAny) return mAny[0];
  } catch {
    // Regex fallback for raw strings
    const m = url.match(/[-\w]{25,}/);
    if (m) return m[0];
  }

  return null;
};

// Normalize to a safe <img> src
const getImageSrc = (raw, { prefer = "uc", size = 1600, debugLabel = "" } = {}) => {
  const placeholder = "/placeholder.png";
  if (!raw) return placeholder;

  const url = String(raw).trim();

  // If it's a Google Photos short link, it won't embed
  if (/photos\.app\.goo\.gl/i.test(url)) {
    console.warn(`[ProductCard] ${debugLabel} Google Photos link cannot be embedded. Rehost the image.`);
    return placeholder;
  }

  // If it's already a direct image or data URL, use as-is
  if (isLikelyImageFile(url)) return url;

  // Handle Google Drive
  if (/drive\.google\.com/i.test(url)) {
    const id = extractDriveId(url);
    if (!id) {
      console.warn(`[ProductCard] ${debugLabel} Drive URL has no file id (maybe a folder or private link):`, url);
      return placeholder;
    }
    const src =
      prefer === "thumbnail"
        ? `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`
        : `https://drive.google.com/uc?export=view&id=${id}`;

    console.debug(`[ProductCard] ${debugLabel} resolved Drive ->`, src);
    return src;
  }

  // Otherwise return as-is (Firebase Storage, Imgur, Postimages, GitHub raw, etc.)
  console.debug(`[ProductCard] ${debugLabel} using original URL ->`, url);
  return url;
};

// Format INR price cleanly
const formatINR = (value) => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  } catch {
    return `₹${value}`;
  }
};

const ProductCard = ({ product, onLoginRequired, debug = false, index }) => {
  const { addToCart, cartItems = [] } = useCart(); // Default to empty array
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  // Get current quantity of this product in cart (with safety checks)
  const currentCartItem = Array.isArray(cartItems) 
    ? cartItems.find(item => item && item.id === product?.id) 
    : null;
  const currentQuantity = currentCartItem?.quantity || 0;

  const handleCardClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const user = auth.currentUser;

    if (!user) {
      onLoginRequired?.();
      return;
    }

    // Check if product is valid
    if (!product?.id) {
      console.error('Invalid product data:', product);
      return;
    }

    // Prevent multiple rapid clicks
    if (isAdding) return;
    setIsAdding(true);

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1, // Always add 1 more
      };

      await addToCart(cartItem);
      
      // Optional: Show a brief success feedback
      setTimeout(() => setIsAdding(false), 500);
      
      // Don't navigate to cart immediately - let user continue shopping
      // navigate("/cart");
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };

  const imgSrc = getImageSrc(product?.imageUrl, {
    prefer: "uc",
    size: 1600,
    debugLabel: debug ? `(card ${index ?? ""})` : "",
  });

  return (
    <div
      className="bg-white/70 backdrop-blur-lg shadow-md rounded-lg p-5 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleCardClick()}
      aria-label={`Open ${product?.name}`}
    >
      <img
        src={imgSrc}
        alt={product?.name || "Product image"}
        className="w-full h-40 object-cover rounded-md mb-3 bg-gray-100"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const original = (product?.imageUrl || "").trim();
          console.warn("[ProductCard] image failed:", e.currentTarget.src, " original:", original);

          // Try Drive thumbnail fallback once
          if (/drive\.google\.com/i.test(original)) {
            const id = extractDriveId(original);
            if (id && !e.currentTarget.dataset.fallbackTried) {
              e.currentTarget.dataset.fallbackTried = "1";
              e.currentTarget.src = `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
              return;
            }
          }

          // Otherwise, show placeholder
          e.currentTarget.src = "/placeholder.png";
        }}
      />

      <h3 className="text-lg font-semibold text-green-900 line-clamp-2">
        {product?.name || "Unnamed product"}
      </h3>

      <p className="text-gray-800 font-medium mt-1">{formatINR(product?.price)}</p>

      <div className="flex items-center justify-between mt-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`px-4 py-2 text-white rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 ${
            isAdding 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-pink-500 hover:bg-pink-600 hover:scale-105 active:scale-95'
          }`}
          aria-label={`Add ${product?.name} to cart`}
        >
          {isAdding ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            'Add to Cart'
          )}
        </button>

        {/* Show current quantity if item is in cart */}
        {currentQuantity > 0 && (
          <div className="flex items-center bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm font-medium">
            <span className="text-xs mr-1">In cart:</span>
            <span className="font-bold">{currentQuantity}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;