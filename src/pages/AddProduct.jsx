import React, { useState, useEffect, useCallback } from "react";
import { db } from "../firebaseConfig";
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Custom Components
const LoadingSpinner = ({ size = "md" }) => {
  const sizes = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div className="flex justify-center items-center">
      <div className={`${sizes[size]} border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductManager = () => {
  // --- States ---
  const [mode, setMode] = useState("add");
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stockStatus: "In Stock",
    weight: "",
    discount: "",
    tags: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Edit mode states
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Banner/Poster states
  const [banners, setBanners] = useState([]);
  const [posters, setPosters] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Media form states
  const [mediaForm, setMediaForm] = useState({
    displayPosition: "Top",
    active: true
  });

  // Confirmation modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: ""
  });

  // Auth states
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    outOfStock: 0,
    activeBanners: 0,
    activePosters: 0
  });

  const auth = getAuth();
  const CLOUDINARY_PRESET = "so_fresh";
  const CLOUDINARY_CLOUD = "dt9x94yeu";

  // --- Activity Tracker (Auto Logout) ---
  useEffect(() => {
    const handleActivity = () => setLastActivity(Date.now());
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);
    
    const checkInactivity = setInterval(() => {
      const minutesInactive = (Date.now() - lastActivity) / (1000 * 60);
      if (minutesInactive > 30 && user) {
        auth.signOut();
        alert("Session expired due to inactivity");
      }
    }, 60000);
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(checkInactivity);
    };
  }, [lastActivity, user, auth]);

  // --- Validation Functions ---
  const validateForm = () => {
    const errors = {};
    
    if (!form.name.trim()) errors.name = "Product name is required";
    if (!form.category) errors.category = "Category is required";
    if (!form.description.trim()) errors.description = "Description is required";
    if (!form.price || parseFloat(form.price) <= 0) errors.price = "Valid price is required";
    if (!form.stockStatus) errors.stockStatus = "Stock status is required";
    if (form.weight && parseFloat(form.weight) <= 0) errors.weight = "Weight must be positive";
    if (form.discount && (parseFloat(form.discount) < 0 || parseFloat(form.discount) > 100)) {
      errors.discount = "Discount must be between 0-100%";
    }
    
    if (mode === "add" && !imageFile) {
      errors.image = "Product image is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateImage = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!file) return "No file selected";
    if (!validTypes.includes(file.type)) return "Only JPG, PNG, and WebP images are allowed";
    if (file.size > maxSize) return "Image size must be less than 5MB";
    return null;
  };

  // --- Handlers ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const error = validateImage(file);
    if (error) {
      alert(error);
      return;
    }
    
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormErrors(prev => ({ ...prev, image: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleMediaFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMediaForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = useCallback(() => {
    setForm({
      name: "",
      category: "",
      description: "",
      price: "",
      stockStatus: "In Stock",
      weight: "",
      discount: "",
      tags: ""
    });
    setImageFile(null);
    setImagePreview(null);
    setSelectedProduct(null);
    setSearchTerm("");
    setFormErrors({});
    setMediaForm({
      displayPosition: "Top",
      active: true
    });
  }, []);

  // --- Cloudinary Upload with Progress ---
  const uploadToCloudinary = async () => {
    if (!imageFile) return null;
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
        { method: "POST", body: formData }
      );
      
      if (!response.ok) throw new Error("Upload failed");
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // --- Firestore Operations ---
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const productsQuery = query(
        collection(db, "products"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(productsQuery);
      const productList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
      setFilteredProducts(productList);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalProducts: productList.length,
        outOfStock: productList.filter(p => p.stockStatus === "Out of Stock").length
      }));
    } catch (error) {
      console.error("Fetch products error:", error);
      alert("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchBanners = async () => {
    setLoadingMedia(true);
    try {
      const querySnapshot = await getDocs(collection(db, "banners"));
      const bannerList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBanners(bannerList);
      setStats(prev => ({
        ...prev,
        activeBanners: bannerList.filter(b => b.active).length
      }));
    } catch (error) {
      console.error("Fetch banners error:", error);
    } finally {
      setLoadingMedia(false);
    }
  };

  const fetchPosters = async () => {
    setLoadingMedia(true);
    try {
      const querySnapshot = await getDocs(collection(db, "posters"));
      const posterList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosters(posterList);
      setStats(prev => ({
        ...prev,
        activePosters: posterList.filter(p => p.active).length
      }));
    } catch (error) {
      console.error("Fetch posters error:", error);
    } finally {
      setLoadingMedia(false);
    }
  };

  // --- Auth Effect ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userRef = doc(db, "User_Data", currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists() && userSnap.data().role === "owner") {
            setIsOwner(true);
            // Load initial data
            fetchProducts();
            fetchBanners();
            fetchPosters();
          } else {
            setIsOwner(false);
          }
        } catch (error) {
          console.error("Auth error:", error);
          setIsOwner(false);
        }
      } else {
        setUser(null);
        setIsOwner(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // --- Search Filter ---
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.tags && product.tags.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // --- Product Operations ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOwner) return;
    
    if (!validateForm()) return;
    
    try {
      const imageUrl = await uploadToCloudinary();
      
      await addDoc(collection(db, "products"), {
        ...form,
        imageUrl,
        price: parseFloat(form.price),
        weight: form.weight ? parseFloat(form.weight) : null,
        discount: form.discount ? parseFloat(form.discount) : null,
        tags: form.tags ? form.tags.split(',').map(tag => tag.trim()) : [],
        createdAt: new Date(),
        createdBy: user.uid,
        createdByEmail: user.email
      });
      
      alert("✅ Product added successfully!");
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Add Product Error:", error);
      alert("❌ Failed to add product. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isOwner || !selectedProduct) return;
    
    if (!validateForm()) return;
    
    try {
      let imageUrl = selectedProduct.imageUrl;
      if (imageFile) {
        imageUrl = await uploadToCloudinary();
      }
      
      const productRef = doc(db, "products", selectedProduct.id);
      await updateDoc(productRef, {
        ...form,
        imageUrl,
        price: parseFloat(form.price),
        weight: form.weight ? parseFloat(form.weight) : null,
        discount: form.discount ? parseFloat(form.discount) : null,
        tags: form.tags ? form.tags.split(',').map(tag => tag.trim()) : [],
        updatedAt: new Date(),
        updatedBy: user.uid
      });
      
      alert("✅ Product updated successfully!");
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Update Product Error:", error);
      alert("❌ Failed to update product.");
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      await deleteDoc(doc(db, "products", selectedProduct.id));
      alert("✅ Product deleted!");
      resetForm();
      fetchProducts();
      setConfirmModal({ isOpen: false });
    } catch (error) {
      console.error("Delete Product Error:", error);
      alert("❌ Failed to delete product.");
    }
  };

  const selectProductForEdit = (product) => {
    setSelectedProduct(product);
    setForm({
      name: product.name || "",
      category: product.category || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      stockStatus: product.stockStatus || "In Stock",
      weight: product.weight?.toString() || "",
      discount: product.discount?.toString() || "",
      tags: product.tags?.join(', ') || ""
    });
    setImagePreview(product.imageUrl);
  };

  // --- Media Operations ---
  const handleAddMedia = async (type) => {
    if (!isOwner || !imageFile) {
      alert(`Please select an image for the ${type}`);
      return;
    }
    
    try {
      const imageUrl = await uploadToCloudinary();
      const collectionName = type === 'banner' ? 'banners' : 'posters';
      
      await addDoc(collection(db, collectionName), {
        imageUrl,
        displayPosition: mediaForm.displayPosition,
        active: mediaForm.active,
        createdAt: new Date(),
        createdBy: user.uid,
        createdByEmail: user.email,
        aspectRatio: type === 'banner' ? '12:3' : '3:4',
        type: type
      });
      
      alert(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} added!`);
      setImageFile(null);
      setImagePreview(null);
      setMediaForm({
        displayPosition: "Top",
        active: true
      });
      
      if (type === 'banner') fetchBanners();
      else fetchPosters();
    } catch (error) {
      console.error(`Add ${type} Error:`, error);
      alert(`❌ Failed to add ${type}.`);
    }
  };

  const toggleMediaStatus = async (item, type) => {
    try {
      const collectionName = type === 'banner' ? 'banners' : 'posters';
      const itemRef = doc(db, collectionName, item.id);
      await updateDoc(itemRef, {
        active: !item.active,
        updatedAt: new Date(),
        updatedBy: user.uid
      });
      
      alert(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} ${!item.active ? "activated" : "deactivated"}!`);
      
      if (type === 'banner') fetchBanners();
      else fetchPosters();
    } catch (error) {
      console.error(`Toggle ${type} Error:`, error);
      alert(`❌ Failed to update ${type}.`);
    }
  };

  const updateMediaPosition = async (item, type, position) => {
    try {
      const collectionName = type === 'banner' ? 'banners' : 'posters';
      const itemRef = doc(db, collectionName, item.id);
      await updateDoc(itemRef, {
        displayPosition: position,
        updatedAt: new Date(),
        updatedBy: user.uid
      });
      
      alert(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} position updated to ${position}!`);
      
      if (type === 'banner') fetchBanners();
      else fetchPosters();
    } catch (error) {
      console.error(`Update ${type} position Error:`, error);
      alert(`❌ Failed to update ${type} position.`);
    }
  };

  const handleDeleteMedia = async (item, type) => {
    try {
      const collectionName = type === 'banner' ? 'banners' : 'posters';
      await deleteDoc(doc(db, collectionName, item.id));
      alert(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} deleted!`);
      
      if (type === 'banner') fetchBanners();
      else fetchPosters();
      setConfirmModal({ isOpen: false });
    } catch (error) {
      console.error(`Delete ${type} Error:`, error);
      alert(`❌ Failed to delete ${type}.`);
    }
  };

  // --- Render Loading & Auth States ---
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-lg">Checking permissions...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access the admin dashboard</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="text-5xl mb-4 text-red-500">🚫</div>
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">Owner privileges required to access this dashboard</p>
          <p className="text-sm text-gray-500 mt-2">Logged in as: {user.email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Manage products, banners, and posters</p>
            <p className="text-sm text-gray-500 mt-1">
              Welcome, {user.email} • Last active: {new Date(lastActivity).toLocaleTimeString()}
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 md:mt-0">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">{stats.activeBanners}</div>
              <div className="text-sm text-gray-600">Active Banners</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-amber-600">{stats.activePosters}</div>
              <div className="text-sm text-gray-600">Active Posters</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
              <div className="text-sm text-gray-600">Out of Stock</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "add", label: "➕ Add Product", color: "blue" },
            { id: "edit", label: "✏️ Manage Products", color: "green" },
            { id: "banner", label: "🖼️ Manage Banners", color: "purple" },
            { id: "poster", label: "🥐 Manage Posters", color: "amber" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setMode(tab.id); resetForm(); }}
              className={`px-5 py-3 rounded-lg font-semibold transition-all ${
                mode === tab.id 
                  ? `bg-${tab.color}-600 text-white shadow-lg` 
                  : `bg-white text-gray-700 hover:bg-${tab.color}-50 hover:border-${tab.color}-200`
              } border`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* ADD PRODUCT MODE */}
          {mode === "add" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Add New Product</h2>
              <p className="text-gray-600 mb-6">Fill in the product details below</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g., Chocolate Fudge Cake"
                      required
                      className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.name ? 'border-red-500' : ''}`}
                    />
                    {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.category ? 'border-red-500' : ''}`}
                    >
                      <option value="">-- Select Category --</option>
                      <option value="Cakes">Cakes</option>
                      <option value="Cookies">Cookies</option>
                      <option value="Pastries">Pastries</option>
                      <option value="Cupcakes">Cupcakes</option>
                      <option value="Breads">Breads</option>
                      <option value="Desserts">Desserts</option>
                    </select>
                    {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe your product..."
                    required
                    className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.description ? 'border-red-500' : ''}`}
                  />
                  {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                      className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.price ? 'border-red-500' : ''}`}
                    />
                    {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Status *
                    </label>
                    <select
                      name="stockStatus"
                      value={form.stockStatus}
                      onChange={handleChange}
                      required
                      className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.stockStatus ? 'border-red-500' : ''}`}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                      <option value="Pre-order">Pre-order</option>
                    </select>
                    {formErrors.stockStatus && <p className="text-red-500 text-sm mt-1">{formErrors.stockStatus}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (grams)
                    </label>
                    <input
                      name="weight"
                      type="number"
                      value={form.weight}
                      onChange={handleChange}
                      placeholder="e.g., 500"
                      className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.weight ? 'border-red-500' : ''}`}
                    />
                    {formErrors.weight && <p className="text-red-500 text-sm mt-1">{formErrors.weight}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      name="discount"
                      type="number"
                      step="0.1"
                      value={form.discount}
                      onChange={handleChange}
                      placeholder="0-100"
                      className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.discount ? 'border-red-500' : ''}`}
                    />
                    {formErrors.discount && <p className="text-red-500 text-sm mt-1">{formErrors.discount}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="e.g., chocolate, birthday, gluten-free"
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="hidden"
                      id="product-image"
                    />
                    <label htmlFor="product-image" className="cursor-pointer block">
                      {imagePreview ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-48 h-48 object-cover rounded-lg mb-4"
                          />
                          <span className="text-blue-600 hover:text-blue-800">
                            Change Image
                          </span>
                        </div>
                      ) : (
                        <div className="py-8">
                          <div className="text-4xl mb-2">📷</div>
                          <p className="text-gray-600">Click to upload product image</p>
                          <p className="text-sm text-gray-500 mt-1">JPG, PNG, or WebP • Max 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {formErrors.image && <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Uploading...</span>
                    </span>
                  ) : (
                    "➕ Add Product"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* EDIT PRODUCT MODE */}
          {mode === "edit" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product List */}
              <div>
                <div className="sticky top-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Product List</h2>
                  
                  <div className="relative mb-4">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, category, or tags..."
                      className="w-full border px-4 py-3 pl-10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Showing {filteredProducts.length} of {products.length} products
                      </span>
                      <button
                        onClick={fetchProducts}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>
                  
                  {loadingProducts ? (
                    <div className="text-center py-12">
                      <LoadingSpinner size="lg" />
                      <p className="text-gray-600 mt-3">Loading products...</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => selectProductForEdit(product)}
                          className={`p-4 border rounded-xl cursor-pointer transition-all ${
                            selectedProduct?.id === product.id
                              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md"
                              : "hover:bg-gray-50 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  product.stockStatus === "In Stock"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {product.stockStatus}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{product.category}</p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="font-bold text-lg">₹{product.price}</span>
                                {product.discount > 0 && (
                                  <span className="text-sm text-red-600">
                                    {product.discount}% off
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {filteredProducts.length === 0 && (
                        <div className="text-center py-12 border rounded-xl">
                          <div className="text-5xl mb-4">📦</div>
                          <p className="text-gray-600">No products found</p>
                          {searchTerm && (
                            <p className="text-sm text-gray-500 mt-1">
                              Try a different search term
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Edit Form */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  {selectedProduct ? "Edit Product" : "Select a Product"}
                </h2>
                
                {selectedProduct ? (
                  <form onSubmit={handleUpdate} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name *
                        </label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            formErrors.name ? "border-red-500" : ""
                          }`}
                        />
                        {formErrors.name && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          required
                          className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            formErrors.category ? "border-red-500" : ""
                          }`}
                        >
                          <option value="">Select Category</option>
                          <option value="Cakes">Cakes</option>
                          <option value="Cookies">Cookies</option>
                          <option value="Pastries">Pastries</option>
                          <option value="Cupcakes">Cupcakes</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="3"
                        required
                        className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          formErrors.description ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (₹) *
                        </label>
                        <input
                          name="price"
                          type="number"
                          step="0.01"
                          value={form.price}
                          onChange={handleChange}
                          required
                          className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            formErrors.price ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock Status *
                        </label>
                        <select
                          name="stockStatus"
                          value={form.stockStatus}
                          onChange={handleChange}
                          required
                          className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="In Stock">In Stock</option>
                          <option value="Low Stock">Low Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (grams)
                        </label>
                        <input
                          name="weight"
                          type="number"
                          value={form.weight}
                          onChange={handleChange}
                          className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount (%)
                        </label>
                        <input
                          name="discount"
                          type="number"
                          step="0.1"
                          value={form.discount}
                          onChange={handleChange}
                          className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Image
                      </label>
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={selectedProduct.imageUrl}
                          alt="Current"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <span className="text-gray-600">Click below to update</span>
                      </div>
                      
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border px-4 py-3 rounded-lg"
                      />
                      {imagePreview && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">New preview:</p>
                          <img
                            src={imagePreview}
                            alt="New preview"
                            className="w-24 h-24 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700"
                      >
                        {uploading ? "Updating..." : "💾 Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: "Delete Product",
                            message: `Are you sure you want to delete "${selectedProduct.name}"? This action cannot be undone.`,
                            onConfirm: handleDeleteProduct,
                            type: "delete"
                          });
                        }}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                    <div className="text-5xl mb-4">📝</div>
                    <p className="text-gray-600">Select a product to edit</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Click on any product from the list to edit its details
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BANNER MODE */}
          {mode === "banner" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Banner */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Banner</h2>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
                  <form onSubmit={(e) => { e.preventDefault(); handleAddMedia('banner'); }}>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Upload Banner Image
                        <span className="text-xs text-gray-500 ml-2">(Recommended: 1200×300 pixels)</span>
                      </label>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                          className="hidden"
                          id="banner-upload"
                        />
                        <label htmlFor="banner-upload" className="cursor-pointer block">
                          {imagePreview ? (
                            <div>
                              <img
                                src={imagePreview}
                                alt="Banner preview"
                                className="w-full object-cover rounded-lg mb-4"
                                style={{ aspectRatio: "12/3" }}
                              />
                              <span className="text-purple-600 hover:text-purple-800">
                                Change Image
                              </span>
                            </div>
                          ) : (
                            <div className="py-8">
                              <div className="text-4xl mb-2">🖼️</div>
                              <p className="text-gray-600">Click to upload banner</p>
                              <p className="text-sm text-gray-500 mt-1">JPG, PNG, or WebP • Max 5MB</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Display Position Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Position *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${mediaForm.displayPosition === "Top" ? "bg-purple-100 border-purple-500" : "hover:bg-gray-50"}`}>
                          <input
                            type="radio"
                            name="displayPosition"
                            value="Top"
                            checked={mediaForm.displayPosition === "Top"}
                            onChange={handleMediaFormChange}
                            className="hidden"
                          />
                          <div className="text-center">
                            <div className="text-2xl mb-1">⬆️</div>
                            <span className="font-medium">Top</span>
                            <p className="text-xs text-gray-500 mt-1">Appears at the top</p>
                          </div>
                        </label>
                        <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${mediaForm.displayPosition === "Middle" ? "bg-purple-100 border-purple-500" : "hover:bg-gray-50"}`}>
                          <input
                            type="radio"
                            name="displayPosition"
                            value="Middle"
                            checked={mediaForm.displayPosition === "Middle"}
                            onChange={handleMediaFormChange}
                            className="hidden"
                          />
                          <div className="text-center">
                            <div className="text-2xl mb-1">⚡</div>
                            <span className="font-medium">Middle</span>
                            <p className="text-xs text-gray-500 mt-1">Appears in the middle</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Active Status */}
                    <div className="mb-6">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="active"
                            checked={mediaForm.active}
                            onChange={handleMediaFormChange}
                            className="sr-only"
                          />
                          <div className={`block w-14 h-8 rounded-full ${mediaForm.active ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${mediaForm.active ? 'translate-x-6' : ''}`}></div>
                        </div>
                        <div className="ml-3">
                          <span className="font-medium text-gray-700">Active Status</span>
                          <p className="text-sm text-gray-500">
                            {mediaForm.active ? "Banner will be visible to users" : "Banner will be hidden from users"}
                          </p>
                        </div>
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={uploading || !imageFile}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Uploading..." : "➕ Add Banner"}
                    </button>
                  </form>
                </div>
              </div>
              
              {/* Manage Banners */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Manage Banners</h2>
                  <span className="text-sm text-gray-600">
                    Active: <span className="font-bold text-green-600">{stats.activeBanners}</span> / Total: {banners.length}
                  </span>
                </div>
                
                {loadingMedia ? (
                  <div className="text-center py-12">
                    <LoadingSpinner size="lg" />
                    <p className="text-gray-600 mt-3">Loading banners...</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {banners.map((banner) => (
                      <div
                        key={banner.id}
                        className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="relative group">
                          <img
                            src={banner.imageUrl}
                            alt="Banner"
                            className="w-full object-cover"
                            style={{ aspectRatio: "12/3" }}
                          />
                          <div className="absolute top-3 right-3 flex gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                banner.active
                                  ? "bg-green-500 text-white shadow-lg"
                                  : "bg-gray-500 text-white"
                              }`}
                            >
                              {banner.active ? "ACTIVE" : "INACTIVE"}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                banner.displayPosition === "Top" 
                                  ? "bg-blue-500 text-white" 
                                  : "bg-amber-500 text-white"
                              }`}
                            >
                              {banner.displayPosition?.toUpperCase() || "TOP"}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
                        </div>
                        
                        <div className="p-4 bg-gray-50">
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Position</p>
                              <div className="flex justify-center gap-2 mt-1">
                                <button
                                  onClick={() => updateMediaPosition(banner, 'banner', 'Top')}
                                  className={`px-3 py-1 text-xs rounded ${banner.displayPosition === 'Top' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                  Top
                                </button>
                                <button
                                  onClick={() => updateMediaPosition(banner, 'banner', 'Middle')}
                                  className={`px-3 py-1 text-xs rounded ${banner.displayPosition === 'Middle' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                  Middle
                                </button>
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Status</p>
                              <button
                                onClick={() => toggleMediaStatus(banner, 'banner')}
                                className={`mt-1 w-full py-1 text-xs rounded-lg font-semibold transition-colors ${
                                  banner.active
                                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                    : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                              >
                                {banner.active ? "Deactivate" : "Activate"}
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setConfirmModal({
                                  isOpen: true,
                                  title: "Delete Banner",
                                  message: "Are you sure you want to delete this banner? This action cannot be undone.",
                                  onConfirm: () => handleDeleteMedia(banner, 'banner'),
                                  type: "delete"
                                });
                              }}
                              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                          <div className="text-xs text-gray-500 mt-3">
                            Added: {new Date(banner.createdAt?.toDate()).toLocaleDateString()} • 
                            Position: {banner.displayPosition || "Top"} • 
                            By: {banner.createdByEmail || "Unknown"}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {banners.length === 0 && (
                      <div className="text-center py-12 border rounded-xl">
                        <div className="text-5xl mb-4">🏞️</div>
                        <p className="text-gray-600">No banners added yet</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Upload your first banner to get started
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* POSTER MODE */}
          {mode === "poster" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Poster */}
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Add Trendy Poster</h2>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
                  <form onSubmit={(e) => { e.preventDefault(); handleAddMedia('poster'); }}>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Upload Poster Image
                        <span className="text-xs text-gray-500 ml-2">(Recommended: 600×800 pixels)</span>
                      </label>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                          className="hidden"
                          id="poster-upload"
                        />
                        <label htmlFor="poster-upload" className="cursor-pointer block">
                          {imagePreview ? (
                            <div>
                              <div className="flex justify-center bg-white p-4 rounded-lg">
                                <img
                                  src={imagePreview}
                                  alt="Poster preview"
                                  className="object-cover rounded-lg shadow-md"
                                  style={{ aspectRatio: "3/4", width: "50%" }}
                                />
                              </div>
                              <span className="text-amber-600 hover:text-amber-800 mt-4 inline-block">
                                Change Image
                              </span>
                            </div>
                          ) : (
                            <div className="py-8">
                              <div className="text-4xl mb-2">🥐</div>
                              <p className="text-gray-600">Click to upload poster</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Vertical images work best • JPG, PNG, or WebP
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Display Position Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Position *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${mediaForm.displayPosition === "Top" ? "bg-amber-100 border-amber-500" : "hover:bg-gray-50"}`}>
                          <input
                            type="radio"
                            name="displayPosition"
                            value="Top"
                            checked={mediaForm.displayPosition === "Top"}
                            onChange={handleMediaFormChange}
                            className="hidden"
                          />
                          <div className="text-center">
                            <div className="text-2xl mb-1">⬆️</div>
                            <span className="font-medium">Top</span>
                            <p className="text-xs text-gray-500 mt-1">Appears at the top</p>
                          </div>
                        </label>
                        <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${mediaForm.displayPosition === "Middle" ? "bg-amber-100 border-amber-500" : "hover:bg-gray-50"}`}>
                          <input
                            type="radio"
                            name="displayPosition"
                            value="Middle"
                            checked={mediaForm.displayPosition === "Middle"}
                            onChange={handleMediaFormChange}
                            className="hidden"
                          />
                          <div className="text-center">
                            <div className="text-2xl mb-1">⚡</div>
                            <span className="font-medium">Middle</span>
                            <p className="text-xs text-gray-500 mt-1">Appears in the middle</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Active Status */}
                    <div className="mb-6">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="active"
                            checked={mediaForm.active}
                            onChange={handleMediaFormChange}
                            className="sr-only"
                          />
                          <div className={`block w-14 h-8 rounded-full ${mediaForm.active ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${mediaForm.active ? 'translate-x-6' : ''}`}></div>
                        </div>
                        <div className="ml-3">
                          <span className="font-medium text-gray-700">Active Status</span>
                          <p className="text-sm text-gray-500">
                            {mediaForm.active ? "Poster will be visible to users" : "Poster will be hidden from users"}
                          </p>
                        </div>
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={uploading || !imageFile}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Uploading..." : "➕ Add Poster"}
                    </button>
                  </form>
                </div>
              </div>
              
              {/* Manage Posters */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Manage Posters</h2>
                  <span className="text-sm text-gray-600">
                    Active: <span className="font-bold text-green-600">{stats.activePosters}</span> / Total: {posters.length}
                  </span>
                </div>
                
                {loadingMedia ? (
                  <div className="text-center py-12">
                    <LoadingSpinner size="lg" />
                    <p className="text-gray-600 mt-3">Loading posters...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                    {posters.map((poster) => (
                      <div
                        key={poster.id}
                        className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="relative group">
                          <img
                            src={poster.imageUrl}
                            alt="Poster"
                            className="w-full object-cover"
                            style={{ aspectRatio: "3/4" }}
                          />
                          <div className="absolute top-2 right-2 flex gap-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                poster.active
                                  ? "bg-green-500 text-white shadow"
                                  : "bg-gray-500 text-white"
                              }`}
                            >
                              {poster.active ? "ON" : "OFF"}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                poster.displayPosition === "Top" 
                                  ? "bg-blue-500 text-white" 
                                  : "bg-amber-500 text-white"
                              }`}
                            >
                              {poster.displayPosition === "Top" ? "TOP" : "MID"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Position</p>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => updateMediaPosition(poster, 'poster', 'Top')}
                                  className={`flex-1 py-1 text-xs rounded ${poster.displayPosition === 'Top' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                  Top
                                </button>
                                <button
                                  onClick={() => updateMediaPosition(poster, 'poster', 'Middle')}
                                  className={`flex-1 py-1 text-xs rounded ${poster.displayPosition === 'Middle' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                  Middle
                                </button>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Status</p>
                              <button
                                onClick={() => toggleMediaStatus(poster, 'poster')}
                                className={`w-full py-1 text-xs rounded font-semibold ${
                                  poster.active
                                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                    : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                              >
                                {poster.active ? "Deactivate" : "Activate"}
                              </button>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              setConfirmModal({
                                isOpen: true,
                                title: "Delete Poster",
                                message: "Are you sure you want to delete this poster? This action cannot be undone.",
                                onConfirm: () => handleDeleteMedia(poster, 'poster'),
                                type: "delete"
                              });
                            }}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 text-sm mt-2"
                          >
                            Delete
                          </button>
                          <div className="text-xs text-gray-500 mt-2">
                            Added: {new Date(poster.createdAt?.toDate()).toLocaleDateString()} • 
                            Position: {poster.displayPosition || "Top"}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {posters.length === 0 && (
                      <div className="col-span-2 text-center py-12 border rounded-xl">
                        <div className="text-5xl mb-4">🎨</div>
                        <p className="text-gray-600">No posters added yet</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Upload your first poster to showcase trending items
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Admin Dashboard • So Fresh Bakery • {new Date().getFullYear()}</p>
          <p className="mt-1">
            Session will expire after 30 minutes of inactivity
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  );
};

export default ProductManager;