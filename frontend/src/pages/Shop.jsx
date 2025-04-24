import { useState, useEffect, useContext } from "react";
import { fetchProducts } from "../api/api"; // changed
import PlantCard from "../components/PlantCard";
import { CartContext } from "../context/CartContext";

export default function Shop() {
  const [plants, setPlants] = useState([]);
  const { addOrUpdate } = useContext(CartContext);

  useEffect(() => {
    fetchProducts().then(setPlants);
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
