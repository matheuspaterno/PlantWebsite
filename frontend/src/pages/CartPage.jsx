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
          className="flex justify-between items-center border-b pb-2"
        >
          <div>
            <p>Plant #{item.productId}</p>
            <p>Qty: {item.quantity}</p>
          </div>
          <div className="flex items-center space-x-4">
            <p>${item.amount.toFixed(2)}</p>
            <button
              onClick={() => remove(item.productId)}
              className="text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center pt-4">
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
