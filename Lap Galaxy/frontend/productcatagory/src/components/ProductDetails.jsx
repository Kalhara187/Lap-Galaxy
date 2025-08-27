import React, { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Login from "./Login"; // Adjust the import path
import CartItem from "./CartItem";
import "../App.css";
import NavBar from "./NavBar";
import Footer from "./Footer"; // Adjust the import path

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productId = window.location.pathname.split("/").pop();
        const response = await fetch(`http://localhost:8080/api/product/${productId}`);
        if (!response.ok) throw new Error("Failed to fetch product details");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, []);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }

    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: `data:${product.imageType};base64,${product.imageBase64}`,
    };

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        return [...prevItems, item];
      }
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  if (loading) {
    return (
      <>
      <NavBar />
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4">Loading product details...</p>
        </div>
      </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
      <NavBar />
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">{error || "Sorry, we couldn't find this product."}</p>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2 text-white bg-amber-500 hover:bg-amber-600 rounded-md shadow transition"
          >
            <ArrowLeft className="mr-2" size={18} /> Go Back
          </button>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <NavBar />
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      <button
        onClick={handleGoBack}
        className="mb-6 inline-flex items-center px-4 py-2 bg-amber-400 text-white text-sm font-medium rounded-lg hover:bg-amber-500 transition duration-300"
      >
        <ArrowLeft className="mr-2" size={20} /> Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        {/* Product Image */}
        <div className="flex items-center justify-center">
          <img
            src={`data:${product.imageType};base64,${product.imageBase64}`}
            alt={product.name}
            className="w-full h-auto max-h-[500px] object-contain rounded-xl"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">{product.name}</h1>

          <div className="flex items-center">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < (product.rating || 4) ? "currentColor" : "none"}
                  className={i < (product.rating || 4) ? "text-amber-500" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({product.reviewCount || 0} reviews)
            </span>
          </div>

          <div className="text-2xl font-bold text-amber-500">Rs. {product.price}</div>

          <div>
            <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-white">Description</h3>
            <p className="text-gray-600 text-center dark:text-gray-300">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border-x-4 border-y-4 border-black">
              <span className="block text-sm text-gray-500 text-center dark:text-gray-400">Brand</span>
              <p className="font-medium text-gray-800 text-center dark:text-white">{product.brand}</p>
              
            </div>
            
          </div>

          <div className="flex items-center space-x-4 pt-4">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg flex items-center justify-center transition"
            >
              <ShoppingCart className="mr-2" size={18} /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Cart Items Display */}
      {cartItems.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Your Cart</h2>
          <CartItem items={cartItems} />
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 flex items-start justify-start bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 h-60 max-w-80 p-6 relative border border-gray-300 animate-fadeIn">
            <div className="border-b pb-3 mb-4 text-center relative">
              <h2 className="text-xl font-semibold text-gray-800">Login</h2>
              <button
                className="absolute top-0 right-0 mt-2 mr-3 text-gray-500 hover:text-red-500 text-xl"
                onClick={() => setShowLogin(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
      <div className="pt-12">
      <Footer />
      </div>
    </div>
    </>
  );
};



export default ProductDetails;
