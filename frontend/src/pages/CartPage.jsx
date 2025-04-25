import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import { CartContext } from "../context/CartContext";

export default function CartPage() {
  const { cart, remove, checkout } = useContext(CartContext);
  const [productsMap, setProductsMap] = useState({});

  // 2.1 Load all products into a map
  useEffect(() => {
    API.get("/products")
      .then((r) => {
        const map = {};
        r.data.forEach((p) => {
          map[p.productId] = p;
        });
        setProductsMap(map);
      })
      .catch(() => setProductsMap({}));
  }, []);

  const total = cart.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Your Cart</h2>

      {cart.map((item) => {
        const prod = productsMap[item.productId] || {};
        const imgUrl = prod.images
          ? `${import.meta.env.VITE_API_BASE_URL}/${prod.images.split(",")[0]}`
          : "";

        return (
          <div
            key={item.productId}
            className="flex items-center bg-light rounded-lg shadow-sm p-4"
          >
            {/* 2.2 Show image */}
            {imgUrl && (
              <img
                src={imgUrl}
                alt={prod.productName}
                className="w-16 h-16 object-cover rounded"
              />
            )}

            {/* 2.3 Show name & quantity */}
            <div className="flex-1 px-4">
              <p className="font-medium text-forest">{prod.productName}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>

            {/* 2.4 Price & remove */}
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
        );
      })}

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
