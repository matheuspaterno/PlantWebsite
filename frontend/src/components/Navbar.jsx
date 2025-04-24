import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-olive text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Plant Shop</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/shop" className="hover:underline">
          Shop
        </Link>
        <Link to="/about" className="hover:underline">
          About
        </Link>
        <Link to="/cart" className="hover:underline">
          Cart
        </Link>
      </div>
    </nav>
  );
}
