import React, { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import DarkMode from "./DarkMode";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");

  const searchRef = useRef(null);
  const navigate = useNavigate();

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "LAPTOPS", path: "/laptops" },
    { name: "GAMING", path: "/gaming" },
    { name: "ACCESSORIES", path: "/accessories" },
    { name: "OFFERS", path: "/offers" }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setShowResults(true);
    try {
      const response = await fetch(`http://localhost:8080/api/product/search?brand=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    navigate("/login");
  };

  const handleRegister = () => navigate("/register");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/");
  };

  const goToProduct = (id) => {
    navigate(`/product/${id}`);
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="text-2xl font-bold text-amber-500 tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
          >
            LAPGALAXY
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className="text-gray-700 dark:text-gray-300 hover:text-amber-500 text-sm font-medium"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="hidden lg:flex items-center relative" ref={searchRef}>
            <input
              type="text"
              placeholder="Search laptop brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-64 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-300 hover:text-amber-500"
              disabled={isSearching}
            >
              <Search size={18} />
            </button>

            {showResults && (
              <div className="absolute top-full left-0 w-full mt-1 z-20 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => goToProduct(product.id)}
                      className="flex items-center w-full gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover" />}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-amber-500">RS: {product.price}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center p-3 text-sm text-gray-500 dark:text-gray-400">No products found</div>
                )}
              </div>
            )}
          </div>

          {/* Auth & Cart */}
          <div className="hidden md:flex items-center gap-4">
            <DarkMode />
            {!isLoggedIn ? (
              <>
                <button onClick={handleLogin} className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-500">Login</button>
                <button onClick={handleRegister} className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-500">Register</button>
              </>
            ) : (
              <button onClick={handleLogout} className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-500">Logout</button>
            )}
            <button
              onClick={() => navigate("/cart")}
              className="relative text-gray-700 dark:text-gray-300 hover:text-amber-500"
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700 dark:text-gray-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700 space-y-4">
          <div className="space-y-2 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className="block text-left w-full text-gray-700 dark:text-gray-300 hover:text-amber-500 text-sm font-medium"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="relative" ref={searchRef}>
            <input
              type="text"
              placeholder="Search laptop brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-300 hover:text-amber-500"
              disabled={isSearching}
            >
              <Search size={18} />
            </button>

            {showResults && (
              <div className="absolute top-full left-0 w-full mt-1 z-20 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => goToProduct(product.id)}
                      className="flex items-center w-full gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover" />}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-amber-500">RS: {product.price}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center p-3 text-sm text-gray-500 dark:text-gray-400">No products found</div>
                )}
              </div>
            )}
          </div>

          {/* Auth Mobile */}
          <div className="flex gap-4">
            {!isLoggedIn ? (
              <>
                <button onClick={handleLogin} className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-500">Login</button>
                <button onClick={handleRegister} className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-500">Register</button>
              </>
            ) : (
              <button onClick={handleLogout} className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-500">Logout</button>
            )}
          </div>

          {/* Bottom Info */}
          <div className="flex justify-between items-center border-t pt-3 dark:border-gray-700">
            <button
              onClick={() => navigate("/cart")}
              className="relative text-gray-700 dark:text-gray-300 hover:text-amber-500"
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span>
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">+94 112 584 406</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
