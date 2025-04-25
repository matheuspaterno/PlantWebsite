// src/pages/CartPage.jsx
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CartPage() {
  const { cart, remove, checkout } = useContext(CartContext);
  const total = cart.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Your Cart</h2>

      {cart.map((item) => (
        <div
          key={item.productId}
          className="flex items-center bg-sage rounded-lg shadow-sm p-4"
        >
          {/* Image */}
          <img
            src={item.image}
            alt={item.productName}
            className="w-16 h-16 object-cover rounded"
          />

          {/* Info */}
          <div className="flex-1 px-4">
            <p className="font-medium text-forest">{item.productName}</p>
            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
          </div>

          {/* Price & Remove */}
          <div className="flex flex-col items-end space-y-2">
            <p className="font-semibold">${item.amount.toFixed(2)}</p>
            <button
              onClick={() => remove(item.productId)}
              className="text-red-600 hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center pt-6">
        <strong>Total: ${total.toFixed(2)}</strong>
        <button
          onClick={checkout}
          className="bg-forest text-white px-4 py-2 rounded hover:bg-dark transition"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
