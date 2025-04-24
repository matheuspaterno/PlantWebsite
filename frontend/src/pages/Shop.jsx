import { useState, useEffect, useContext } from "react";
import API from "../api/api"; // changed
import PlantCard from "../components/PlantCard";
import { CartContext } from "../context/CartContext";
import mockProducts from "../data/mockProducts";


export default function Shop() {
  const [plants, setPlants] = useState([]);
  const { addOrUpdate } = useContext(CartContext);

  useEffect(() => {
    if (import.meta.env.VITE_USE_MOCKS === "true") {
      setPlants(mockProducts);
    } else {
      API.get("/products")
        .then((r) => setPlants(r.data))
        .catch(() => setPlants([]));
    }
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {plants.map((p) => (
        <PlantCard
          key={p.productId}
          plant={p}
          onAdd={(qty) =>
            addOrUpdate({
              productId: p.productId,
              quantity: qty,
              amount: p.price * qty,
            })
          }
        />
      ))}
    </div>
  );
}
