import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import AdminDashboard from './components/AdminDashboard.jsx'
import LapGalaxy from './components/LapGalaxy.jsx'
import ProductList from './components/ProductList.jsx'
import Home from './components/Home.jsx'
import UserRegister from './components/UserRegister.jsx';
import Login from './components/Login.jsx';
import ProductDetails from './components/ProductDetails.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import LaptopComparison from './components/LaptopComparison.jsx';




function App() {
  

  return (
    <>
      <div>
        
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lap" element={<LapGalaxy />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/laptops" element={<LaptopComparison />} />


      </Routes>
    </Router>
    
    
    
       
      </div>
    </>
  )
}

export default App
