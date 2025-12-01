import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  getDoc
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stockStatus: "", // updated field
    imageUrl: "",
    weight: "",
    discount: ""
  });

  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();

  // Auth & Role Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userRef = doc(db, "User_Data", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const role = userSnap.data().role;
            setIsOwner(role === "owner");
          }
        } catch (error) {
          console.error("Error checking user role:", error);
        }
      } else {
        setUser(null);
        setIsOwner(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOwner) {
      alert("You don't have permission to add products.");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        ...form,
        price: parseFloat(form.price),
        weight: form.weight ? parseFloat(form.weight) : null,
        discount: form.discount ? parseFloat(form.discount) : null,
        stockStatus: form.stockStatus,
        createdAt: new Date(),
        createdBy: user.uid,
        createdByEmail: user.email
      });

      alert("✅ Product added successfully!");

      setForm({
        name: "",
        category: "",
        description: "",
        price: "",
        stockStatus: "",
        imageUrl: "",
        weight: "",
        discount: ""
      });
    } catch (err) {
      console.error("Error adding product:", err);
      alert("❌ Failed to add product.");
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-500">Checking permissions...</div>;

  if (!user)
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">🔒 Please login to access this page.</p>
        <button onClick={() => navigate("/login")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Go to Login
        </button>
      </div>
    );

  if (!isOwner)
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">🚫 You need owner privileges to add products.</p>
        <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-gray-700 text-white rounded">
          Return to Home
        </button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg mt-10 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Category --</option>
            <option value="Cakes">Cake</option>
            <option value="Cookies">Cookie</option>
            <option value="Pastry">Pastry</option>
            <option value="Bread">Bread</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            placeholder="Enter product description"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Price ₹</label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 250"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Stock Status</label>
            <select
              name="stockStatus"
              value={form.stockStatus}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select Status --</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Weight (grams)</label>
            <input
              name="weight"
              type="number"
              value={form.weight}
              onChange={handleChange}
              placeholder="e.g. 250"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Discount %</label>
            <input
              name="discount"
              type="number"
              value={form.discount}
              onChange={handleChange}
              placeholder="e.g. 10"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Image URL</label>
          <input
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          ➕ Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
