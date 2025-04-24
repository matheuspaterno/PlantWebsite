import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-light">
      <h1 className="text-5xl font-semibold text-forest mb-6">
        Welcome to Plant Shop
      </h1>
      <Link
        to="/shop"
        className="px-8 py-3 bg-sage text-white rounded-md hover:bg-olive transition"
      >
        Shop Plants
      </Link>
    </div>
  );
}
