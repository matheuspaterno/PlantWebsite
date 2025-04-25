import { useState } from "react";
import { useToast } from "../context/ToastContext";


export default function PlantCard({ plant, onAdd }) {
  const [qty, setQty] = useState(1);
  const toast = useToast();

  const imgSrc =
    plant.image ||
    `${import.meta.env.VITE_API_BASE_URL}/${plant.images.split(",")[0]}`;

  function handleAdd() {
    onAdd(qty);
    toast(`✅ Added ${qty}× ${plant.productName} to your cart!`, "success");
  }

  return (
    <div className="border bg-dark rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
      <img
        src={imgSrc}
        alt={plant.productName}
        className="h-2/3 w-full object-cover"
      />

      <div className="p-4 flex flex-col">
        <h2 className="mt-1 text-xl font-semibold text-light">
          {plant.productName}
        </h2>
        <p className="text-light flex-grow mt-2">{plant.description}</p>
        <div className="mt-4 flex items-center mx-auto space-x-2">
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(+e.target.value)}
            className="w-16 border rounded text-center py-2"
          />
          <button
            onClick={() => handleAdd()}
            disabled={qty < 1}
            className="bg-olive text-white px-4 py-2 rounded hover:bg-forest transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
