import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth, provider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import ProductCard from "../components/ProductCard";

import DividerFooter from "../components/DividerAndFooter";
import BottomBanner from "./BannerBottom";
import TrendyPosters from "./TrendyPosters";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((item) =>
    (item?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const groupedByCategory = filtered.reduce((groups, product) => {
    const category = product?.category || "Uncategorized";
    if (!groups[category]) groups[category] = [];
    groups[category].push(product);
    return groups;
  }, {});

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      setShowLoginModal(false);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <>
      {/* Wrapper: white background with soft pink/green accents */}
      <div className="min-h-screen py-10 px-4 md:px-16 relative overflow-hidden bg-white">
        {/* Pastel blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-pink-50 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-green-50 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-green-900 mb-3">
              So Fresh Delight
            </h1>
            <p className="text-pink-600 text-lg sm:text-xl font-light max-w-2xl mx-auto">
              Crafting sweet moments with artisanal delights
            </p>
          </div>

          {/* Search Bar (light theme) */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-200/30 to-emerald-200/30 rounded-xl blur-sm group-hover:blur-0 transition-all duration-300" />
              <input
                type="text"
                placeholder="Search cakes, cookies, gifts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="relative w-full p-4 rounded-xl border border-pink-200 bg-white text-slate-800 placeholder-slate-400 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-500/80">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Sections */}
          {Object.entries(groupedByCategory).map(([category, items]) => (
            <div key={category} className="mb-16">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-md">
                    <span className="text-2xl">🍰</span>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-900 mb-1">
                      {category}
                    </h2>
                    <div className="h-1 bg-gradient-to-r from-green-500 to-transparent rounded-full w-24" />
                  </div>
                  <div className="text-slate-600 text-sm font-medium">
                    {items.length} item{items.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-6 px-2">
                    {items.map((product, index) => (
                      <div
                        key={product.id}
                        className="min-w-[240px] max-w-[260px] flex-shrink-0 transform hover:scale-105 transition-all duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-pink-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                          <div className="relative">
                            <ProductCard product={product} onLoginRequired={() => setShowLoginModal(true)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* No results */}
          {Object.keys(groupedByCategory).length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">No products found</h3>
              <p className="text-slate-600">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 w-[90%] max-w-md text-center relative border border-pink-100">
            <h2 className="text-2xl font-bold text-green-900 mb-2">Login Required</h2>
            <p className="text-sm text-slate-600 mb-6">Please log in with Google to add this item to your cart.</p>
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            <button onClick={() => setShowLoginModal(false)} className="mt-4 text-sm text-slate-600 hover:text-slate-800 underline">
              Cancel
            </button>
          </div>
        </div>
      )}
      <BottomBanner />
      <TrendyPosters />
<DividerFooter />
    
    </>
  );
};

export default HomePage;
