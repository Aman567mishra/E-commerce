import React from "react";
import { ShoppingCart } from "lucide-react";

const Header = ({ search, setSearch, cartCount }) => {
  return (
    <nav className="bg-pink-100 p-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold text-pink-600">Sweet Treats Bakery</h1>
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded-lg w-1/2"
      />
      <div className="relative">
        <ShoppingCart size={28} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-sm px-1">
            {cartCount}
          </span>
        )}
      </div>
    </nav>
  );
};

export default Header;
