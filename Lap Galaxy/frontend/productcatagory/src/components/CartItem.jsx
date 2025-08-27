import React from "react";

const CartItem = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow">
          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-500">Rs. {item.price} x {item.quantity}</p>
          </div>
          <div className="font-bold text-amber-600">Rs. {item.price * item.quantity}</div>
        </div>
      ))}
    </div>
  );
};

export default CartItem;
