import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import DividerFooter from "../components/DividerAndFooter";

// --- Image URL helpers (same as ProductCard) ---
const isLikelyImageFile = (url) =>
  /^data:image\/|^https?:\/\/.+\.(png|jpg|jpeg|gif|webp|avif)(\?|#|$)/i.test(url);

const extractDriveId = (raw) => {
  if (!raw) return null;
  const url = String(raw).trim();

  if (isLikelyImageFile(url)) return null;
  if (/photos\.app\.goo\.gl/i.test(url)) return null;
  if (/drive\.google\.com\/drive\/(u\/\d\/)?folders\//i.test(url)) return null;

  try {
    const u = new URL(url);

    const mPath = u.pathname.match(/\/file\/d\/([^/]+)/);
    if (mPath) return mPath[1];

    if ((/\/uc$/i.test(u.pathname) || /\/open$/i.test(u.pathname)) && u.searchParams.get("id")) {
      return u.searchParams.get("id");
    }

    const qid = u.searchParams.get("id");
    if (qid) return qid;

    const mAny = u.href.match(/[-\w]{25,}/);
    if (mAny) return mAny[0];
  } catch {
    const m = url.match(/[-\w]{25,}/);
    if (m) return m[0];
  }

  return null;
};

const getImageSrc = (raw, { prefer = "uc", size = 1200 } = {}) => {
  const placeholder = "/placeholder.png";
  if (!raw) return placeholder;

  const url = String(raw).trim();

  if (/photos\.app\.goo\.gl/i.test(url)) return placeholder;
  if (isLikelyImageFile(url)) return url;

  if (/drive\.google\.com/i.test(url)) {
    const id = extractDriveId(url);
    if (!id) return placeholder;

    return prefer === "thumbnail"
      ? `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`
      : `https://drive.google.com/uc?export=view&id=${id}`;
  }

  return url;
};

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, addToCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  const handleIncreaseQuantity = (item) => {
    if (updateQuantity) {
      updateQuantity(item.id, item.quantity + 1);
    } else {
      addToCart(item);
    }
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity <= 1) {
      removeFromCart(item.id);
    } else if (updateQuantity) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
      addToCart({ ...item, quantity: item.quantity - 1 });
    }
  };

  const handleDirectQuantityChange = (item, newQuantity) => {
    const quantity = parseInt(newQuantity) || 1;
    if (quantity < 1) {
      removeFromCart(item.id);
    } else if (updateQuantity) {
      updateQuantity(item.id, quantity);
    }
  };

  const generateWhatsAppMessage = () => {
    let message = "🛒 *New Order Request*\n\n*Order Details:*\n";

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ₹${item.price} each\n`;
      message += `   Subtotal: ₹${item.price * item.quantity}\n`;
      message += `   Link: ${window.location.origin}/product/${item.id}\n\n`;
    });

    message += `*Order Summary:*\nSubtotal: ₹${subtotal}\n`;
    message += `*Total: ₹${total}*\n\n`;
    message += "Please confirm this order. Thank you! 🙏";

    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
     
      return;
    }
    const message = generateWhatsAppMessage();
    const phoneNumber = "919440051099";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  if (cart.length === 0) {
    return (
      <>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h2>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-4">Add some products to get started!</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
       <DividerFooter />
       </>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Your Cart</h2>
          <button onClick={() => navigate("/")} className="text-blue-600 hover:text-blue-800 font-medium">
            ← Continue Shopping
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {cart.map((item) => (
              <div key={item.id} className="p-6 flex items-center space-x-4 hover:bg-gray-50">
                <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                  <img
                    src={getImageSrc(item.imageUrl || item.image, { prefer: "uc", size: 1200 })}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const original = (item?.imageUrl || "").trim();
                      if (/drive\.google\.com/i.test(original)) {
                        const id = extractDriveId(original);
                        if (id && !e.currentTarget.dataset.fallbackTried) {
                          e.currentTarget.dataset.fallbackTried = "1";
                          e.currentTarget.src = `https://drive.google.com/thumbnail?id=${id}&sz=w800`;
                          return;
                        }
                      }
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                </div>

                <div className="flex-1">
                  <h4
                    className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    {item.name}
                  </h4>
                  <p className="text-gray-600">₹{item.price?.toLocaleString()} each</p>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-1 truncate">{item.description}</p>
                  )}
                </div>

                <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-2">
                  <button onClick={() => handleDecreaseQuantity(item)} className="w-8 h-8 rounded-full bg-white text-gray-700 hover:bg-red-100 hover:text-red-600 flex items-center justify-center font-bold text-lg shadow-sm">
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleDirectQuantityChange(item, e.target.value)}
                    className="w-16 text-center font-bold text-lg text-gray-800 bg-transparent border-none outline-none"
                  />
                  <button onClick={() => handleIncreaseQuantity(item)} className="w-8 h-8 rounded-full bg-white text-gray-700 hover:bg-green-100 hover:text-green-600 flex items-center justify-center font-bold text-lg shadow-sm">
                    +
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-lg font-bold text-gray-800">
                    ₹{((item.price || 0) * item.quantity).toLocaleString()}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-sm text-gray-500">
                      {item.quantity} × ₹{item.price?.toLocaleString()}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                  title="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 border-t">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                <span>{cart.length} product{cart.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-gray-800 pt-3 border-t border-gray-300">
                <span>Total:</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  if (window.confirm("Clear your entire cart?")) clearCart();
                }}
                className="flex-1 bg-gray-300 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-400 font-semibold"
              >
                Clear Cart
              </button>
              <button
                onClick={handleWhatsAppOrder}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center space-x-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967..."/>
                </svg>
                <span>Place Order via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DividerFooter />
    </>
  );
};


export default CartPage;
