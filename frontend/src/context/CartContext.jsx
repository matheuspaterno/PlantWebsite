import { createContext, useState, useEffect } from "react";
import API from "../api/api";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const useMocks = import.meta.env.VITE_USE_MOCKS === "true";

  useEffect(() => {
    if (useMocks) {
      setCart([]); // start empty
      return;
    }
    API.get("/cart")
      .then((r) => setCart(r.data || []))
      .catch(() => setCart([]));
  }, []);

  const addOrUpdate = (item) => {
    if (useMocks) {
      setCart((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        if (existing) {
          return prev.map((i) => (i.productId === item.productId ? item : i));
        }
        return [...prev, item];
      });
      return Promise.resolve();
    }
    return API.post("/cart", item).then((r) => setCart(r.data));
  };

  const remove = (id) => {
    if (useMocks) {
      setCart((prev) => prev.filter((i) => i.productId !== id));
      return Promise.resolve();
    }
    return API.delete(`/cart/${id}`).then(() =>
      setCart((prev) => prev.filter((i) => i.productId !== id))
    );
  };

  const checkout = () => {
    if (useMocks) {
      alert("Mock checkout! No order is placed.");
      return Promise.resolve();
    }
    return API.get("/checkout").then((r) => {
      const url = r.data[0]?.stripe?.url;
      if (url) window.location.href = url;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addOrUpdate, remove, checkout }}>
      {children}
    </CartContext.Provider>
  );
}
