import { useState, useEffect, useContext } from "react";
import API from "../api/api"; // changed
import PlantCard from "../components/PlantCard";
import { CartContext } from "../context/CartContext";
import mockProducts from "../data/mockProducts";


export default function Shop() {
  const [plants, setPlants] = useState([]);
  const { addOrUpdate } = useContext(CartContext);

useEffect(() => {
  API.get("/products")
    .then((res) => {
      console.log("🔍 GET /products response:", res.status, res.data);

      const normalized = res.data.map((p) => ({
        productId: p.product_id,
        catId: p.cat_id,
        productName: p.product_name,
        description: p.description,
        price: p.price,
        qoh: p.qoh,
        // full URL to the static asset on your server:
        image: `${import.meta.env.VITE_API_BASE_URL}/Plants/${p.images}`,
      }));

      setPlants(normalized);
    })
    .catch((err) => {
      console.error("❌ GET /products error:", err);
      setPlants([]);
    });
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
              productName: p.productName,
              image: p.image || `${import.meta.env.VITE_API_BASE_URL}/${p.images.split(",")[0]}`,
              quantity: qty,
              amount: p.price * qty,
            })
          }
        />
      ))}
    </div>
  );
}
