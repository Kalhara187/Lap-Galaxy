import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Eye icon from lucide-react (or use any icon lib)

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    username: "",
    newPassword: ""
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8080/api/users/reset-password", formData);
      setMessage("✅ Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("❌ " + (err.response?.data || "Failed to reset password"));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('reset-password.jpg')` }}
    >
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/40">
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Reset Password</h2>

        {message && (
          <p className={`text-center mb-4 font-semibold ${message.startsWith("✅") ? "text-green-300" : "text-red-300"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <input
            type="text"
            name="username"
            placeholder="👤 username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder="🔒 new password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-teal-500 text-white py-2 rounded-xl hover:from-blue-600 hover:to-teal-600 transition font-semibold"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
