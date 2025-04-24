import { useState } from "react";

export default function PlantCard({ plant, onAdd }) {
  const [qty, setQty] = useState(1);
  const img = plant.images.split(",")[0];

  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
      <img
        src={`${import.meta.env.VITE_API_BASE_URL}/${img}`}
        alt={plant.productName}
        className="h-48 w-full object-cover"
      />
      <div className="p-4 flex flex-col">
        <h2 className="text-xl font-semibold text-forest">
          {plant.productName}
        </h2>
        <p className="text-dark flex-grow mt-2">{plant.description}</p>
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(+e.target.value)}
            className="w-16 border rounded text-center"
          />
          <button
            onClick={() => onAdd(qty)}
            className="bg-olive text-white px-4 py-2 rounded hover:bg-forest transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
