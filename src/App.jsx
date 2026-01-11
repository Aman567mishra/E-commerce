import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import AddProduct from "./pages/AddProduct";
import Banner from "./pages/Banner";
import CategoryBar from "./components/CategoryBar";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetails";
import Navbar from "./components/Navbar";

import GalleryPage from "./pages/GalleryPage";
// import TrendyPosters from "./pages/TrendyPosters";
import OffersPage from "./pages/OfferPage";
import About from "./pages/About";

// import Dark from "./components/Dark";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isHomePage = location.pathname === "/";

  return (
    <>
    
      <Navbar />
      {isHomePage && <Banner />}
      <CategoryBar />
      {/* <TrendyPosters /> */}

      <Routes>
        <Route path="/" element={<HomePage /> } />
        <Route path="/offers" element={<OffersPage /> } />
        <Route path="/about" element={<About/> } />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/Gallery" element={<GalleryPage />} />
      </Routes>
      
      
    </>
    
  );
};

export default App;
