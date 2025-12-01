import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth, provider } from "../firebaseConfig";
import { useCart } from "../context/CartContext";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import HomePage from "./HomePage";
import BakeryFAQ from "../components/BakeryFAQ";
import WaveDivider from "../components/WaveDivider";
import DividerFooter from "../components/DividerAndFooter";

const getImageSrc = (url) => {
  if (!url) return "/placeholder.png";
  const driveMatch = url.match(/\/file\/d\/(.+?)\/view/);
  if (driveMatch) {
    const fileId = driveMatch[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  if (url.includes("drive.google.com/uc")) {
    return url;
  }
  return url;
};

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setProduct(null);
      setQuantity(1);
      if (location.state?.product && location.state.product.id === id) {
        setProduct(location.state.product);
        return;
      }
      try {
        const ref = doc(db, "products", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === "inc" ? prev + 1 : prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      addToCart({ ...product, quantity });
      navigate("/cart");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      setShowLoginModal(false);
      addToCart({ ...product, quantity });
      navigate("/cart");
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  if (!product) return <div className="text-center py-10 text-sm">Loading...</div>;

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img
            src={getImageSrc(product.imageUrl)}
            alt={product.name}
            className="w-full max-w-xs md:max-w-md h-72 md:h-96 object-cover rounded shadow"
            onError={(e) => {
              if (product.imageUrl?.includes("drive.google.com")) {
                const match = product.imageUrl.match(/\/file\/d\/(.+?)\/view/);
                if (match) {
                  e.target.src = `https://lh3.googleusercontent.com/d/${match[1]}`;
                }
              } else {
                e.target.src = "/placeholder.png";
              }
            }}
          />
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-xl md:text-3xl font-bold text-pink-700 mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 text-base md:text-xl mb-2">
            <span className="text-green-600 font-semibold">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="line-through text-gray-500 text-sm md:text-base">₹{product.originalPrice}</span>
                <span className="bg-red-100 text-red-600 text-xs md:text-sm px-2 py-1 rounded">
                  Save ₹{product.originalPrice - product.price}
                </span>
              </>
            )}
          </div>

          <p className="text-xs md:text-sm text-gray-600 mb-1">
            Product Weight: <strong>{product.weight || "N/A"}g</strong>
          </p>

          <p className={`mt-1 font-semibold text-xs md:text-sm ${product.stockStatus === "In Stock" ? "text-green-600" : "text-red-600"}`}>
            {product.stockStatus || "Unknown"}
          </p>

          <div className="mt-4">
            <label className="block font-medium mb-1 text-xs md:text-sm">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange("dec")}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-10 text-center border rounded text-sm"
              />
              <button
                onClick={() => handleQuantityChange("inc")}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stockStatus !== "In Stock"}
            className={`mt-6 w-full md:w-auto px-5 py-2 rounded text-white font-semibold text-sm md:text-base ${
              product.stockStatus === "In Stock" ? "bg-pink-600 hover:bg-pink-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>

          <div className="mt-6">
            <h3 className="font-semibold text-base text-pink-600 mb-1">Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {product.description || "No description available."}
            </p>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl px-6 py-6 w-[90%] max-w-md text-center relative">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Login Required</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please log in with Google to add this item to your cart.
            </p>
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <HomePage />
      {/* <WaveDivider /> */}
      <BakeryFAQ />
      <DividerFooter />
    </>
  );
};

export default ProductDetail;
