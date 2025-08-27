import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Laptop2, BadgeDollarSign, Info, CheckCircle, XCircle } from "lucide-react";

const LaptopCompare = () => {
  const [products, setProducts] = useState([]);
  const [selectedLaptop1, setSelectedLaptop1] = useState(null);
  const [selectedLaptop2, setSelectedLaptop2] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/product/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const renderLaptopDetails = (laptop) => {
    if (!laptop)
      return (
        <div className="flex items-center justify-center h-80 text-gray-400 italic border-2 border-dashed rounded-xl bg-white/40">
          Select a laptop to view details
        </div>
      );

    return (
      <div className="backdrop-blur-md bg-white/70 border border-gray-200 shadow-xl p-6 rounded-2xl transition-all hover:shadow-2xl">
        <div className="flex justify-center mb-4">
        <img
          src={`data:image/jpeg;base64,${laptop.imageBase64}`}
          alt={laptop.name}
          className="w-48 h-48 object-cover rounded-lg mb-4 hover:scale-105 transition-transform duration-300"
        />
      </div>  
        <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">{laptop.name}</h2>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li className="flex items-center gap-2">
            <Laptop2 className="w-4 h-4 text-blue-500" />
            <strong>Brand:</strong> <span className="ml-1">{laptop.brand}</span>
          </li>
          <li className="flex items-center gap-2">
            <BadgeDollarSign className="w-4 h-4 text-green-600" />
            <strong>Price:</strong> <span className="ml-1">RS: {laptop.price}</span>
          </li>
          <li className="flex flex-col gap-2">
         <div className="flex items-center gap-2">
           <Info className="w-5 h-5 text-yellow-600" />
          <strong className="text-yellow-700 text-lg">Description:</strong>
         </div>
         <p className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-gray-700 leading-relaxed text-sm shadow-sm">
         {laptop.description}
        </p>
        </li>
          <li className="flex items-center gap-2">
            {laptop.productAvailable ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <strong>Available:</strong>
            <span className="ml-1">{laptop.productAvailable ? "Yes" : "No"}</span>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-10 drop-shadow">
            Select the Best One...
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Laptop 1</label>
              <select
                onChange={(e) =>
                  setSelectedLaptop1(products.find((p) => p.id === parseInt(e.target.value)))
                }
                className="w-full p-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Choose Laptop 1 --</option>
                {products.map((laptop) => (
                  <option key={laptop.id} value={laptop.id}>
                    {laptop.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Laptop 2</label>
              <select
                onChange={(e) =>
                  setSelectedLaptop2(products.find((p) => p.id === parseInt(e.target.value)))
                }
                className="w-full p-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Choose Laptop 2 --</option>
                {products.map((laptop) => (
                  <option key={laptop.id} value={laptop.id}>
                    {laptop.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {renderLaptopDetails(selectedLaptop1)}
            {renderLaptopDetails(selectedLaptop2)}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LaptopCompare;
