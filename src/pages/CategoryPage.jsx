import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, auth, provider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import ProductCard from "../components/ProductCard";
import StackCardCollection from "../components/StackCardCollection";
import BakeryFooter from "../components/Footer";
import WaveDivider from "../components/WaveDivider";
import BakeryFAQ from "../components/BakeryFAQ";
import DividerFooter from "../components/DividerAndFooter";
import TrendyPosters from "./TrendyPosters";
import BottomBanner from "./BannerBottom";

const CategoryPage = () => {
  const { categoryName, subCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Trigger login modal
  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      setShowLoginModal(false);
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  // THEME: green & pink accents
  // Using Tailwind colors: green-600/700 and pink-500/600

  const categoryMappings = {
    cakes: ["cake", "cakes"],
    "muffins-cupcakes": ["muffin", "cupcake", "muffins", "cupcakes"],
    "cheese-cupcake": ["muffin", "cupcake", "muffins", "cupcakes"],
    cookies: ["cookie", "cookies"],
    "healthy-cookies": [
      "healthy cookie",
      "oats",
      "ragi",
      "wheat",
      "jowar",
      "coconut",
      "almond",
    ],
    "chocolate-cakes": ["chocolate cake"],
    vanilla: ["vanilla"],
    chocolate: ["chocolate", "choco"],
    "black-forest": ["black forest"],
    "chocolate-truffle": ["chocolate truffle", "truffle"],
    "chocolate-mousse": ["chocolate mousse", "mousse"],
    pineapple: ["pineapple"],
    strawberry: ["strawberry"],
    butterscotch: ["butterscotch"],
    "red-velvet": ["red velvet"],
    "choco-chip": ["choco chip", "chocolate chip"],
    nankhatai: ["nankhatai", "cookies"],
    "jim-jam": ["jim jam", "jim-jam"],
    custard: ["custard"],
    jeera: ["jeera"],
    thandai: ["thandai"],
    oats: ["oats"],
    ragi: ["ragi"],
    "wheat-coin": ["wheat"],
    jowar: ["jowar"],
    coconut: ["coconut"],
    almond: ["almond"],
    "crunchy-nuts": ["crunchy nuts"],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    const searchTerm = subCategory || categoryName;
    const normalizedSearchTerm = searchTerm?.toLowerCase().replace(/\s+/g, "-");
    const keywords =
      categoryMappings[normalizedSearchTerm] || [searchTerm?.toLowerCase()];

    const filtered = products.filter((product) => {
      const searchableText = `${product.name?.toLowerCase()} ${product.category?.toLowerCase()} ${product.description?.toLowerCase()} ${product.tags?.join(" ").toLowerCase()}`;
      return keywords.some((keyword) => searchableText.includes(keyword));
    });

    setFilteredProducts(filtered);
  }, [products, categoryName, subCategory]);

  const getDisplayTitle = () => {
    const term = subCategory || categoryName;
    return (
      term?.split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") || "Products"
    );
  };

  const getBreadcrumb = () => {
    const crumbs = ["Home"];
    if (categoryName) crumbs.push(categoryName.replace(/-/g, " "));
    if (subCategory) crumbs.push(subCategory.replace(/-/g, " "));
    return crumbs.map((c) =>
      c
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    );
  };

  return (
    <>
      {/* Page Wrapper: WHITE background */}
      <div className="min-h-screen px-6 py-10 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              {getBreadcrumb().map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="w-4 h-4 mx-2 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span
                    className={
                      index === getBreadcrumb().length - 1
                        ? "text-pink-600 font-medium"
                        : "hover:text-green-700"
                    }
                  >
                    {crumb}
                  </span>
                </li>
              ))}
            </ol>
          </nav>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-900 mb-2">
              {getDisplayTitle()}
            </h1>
            <p className="text-pink-500">
              {subCategory
                ? `All products containing "${getDisplayTitle()}"`
                : `Explore our ${getDisplayTitle().toLowerCase()} collection`}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
              <span className="inline-block w-2 h-2 rounded-full bg-pink-500" />
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-2 border-t-green-600"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-700">
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="mb-6">
                We couldn't find any products matching "{getDisplayTitle()}".
                <br />
                Try another category or check back later.
              </p>
              <button
                onClick={() => window.history.back()}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition shadow-sm"
              >
                Go Back
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onLoginRequired={handleLoginRequired}
                />
              ))}
            </div>
          )}

          {/* Suggestions */}
          {subCategory && filteredProducts.length > 0 && (
            <div className="mt-12 text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Explore other categories
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "cakes",
                  "cookies",
                  "muffins-cupcakes",
                  "healthy-cookies",
                ]
                  .filter((cat) => cat !== categoryName)
                  .map((category) => (
                    <a
                      key={category}
                      href={`/categories/${category}`}
                      className="bg-white hover:bg-pink-50 text-green-700 border border-pink-200 px-4 py-2 rounded-full text-sm transition shadow-sm"
                    >
                      {category
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white text-gray-900 p-6 rounded-2xl w-full max-w-md text-center shadow-xl ring-1 ring-gray-200">
            <h2 className="text-2xl font-bold mb-2 text-green-700">Login Required</h2>
            <p className="mb-6 text-gray-600">
              Please sign in with Google to add items to your cart.
            </p>
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
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
              className="mt-4 text-sm text-pink-600 hover:text-pink-700 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Keep these sections - they already adapt to white backgrounds if they use Tailwind */}
      <TrendyPosters />
      <StackCardCollection />
      <BottomBanner />
      <BakeryFAQ />
      <DividerFooter />
      
    </>
  );
};

export default CategoryPage;
