import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuPage from "./MenuPage";
import items from "./ItemsData"; //Import items array

const ItemsPage = () => {
  const [menuOpen, setMenuOpen] = useState(false); //Menu burger toggle

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-roboto relative overflow-hidden">
      {/* Header */}
      <header className="bg-blue-main text-white flex justify-between items-center p-4">
        <h1 className="text-3xl">ALL ITEMS</h1>
        <button onClick={toggleMenu} className="text-3xl cursor-pointer">
          {menuOpen ? "×" : "☰"}
        </button>
      </header>

      {/* Dropdown */}
      <div className="flex items-center px-4 py-2 bg-gray-100">
        <label htmlFor="sort" className="text-lg font-bold text-gray-700 mr-2">
          Sort by:
        </label>
        <select
          id="sort"
          className="border rounded px-3 py-2 bg-white shadow-sm focus:outline-none"
          defaultValue="newest"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="expiry-soon">Expiring Soon</option>
        </select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {items.map((item) => (
          <Link
            to={`/item/${item.id}`}
            key={item.id}
            className={`bg-white rounded-lg shadow p-4 relative text-center block ${
              item.expired ? "border border-red-400" : ""
            }`}
          >
            {/* New Badge */}
            {item.isNew && (
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </div>
            )}
            {/* Warning Badges */}
            {item.warning === "red" && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                !
              </div>
            )}
            {item.warning === "orange" && (
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                !
              </div>
            )}
            {item.warning === "blue" && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                !
              </div>
            )}

            {/* Item Details */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-24 object-contain rounded mb-3"
            />
            <p className="font-semibold">{item.name}</p>
            <span className="text-gray-500 text-sm block">{item.date}</span>
            <span
              className={`text-sm font-semibold ${
                item.expired ? "text-red-600" : "text-gray-600"
              }`}
            >
              {item.daysLeft} days left
            </span>
          </Link>
        ))}
      </div>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-white transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <MenuPage onBackToItems={toggleMenu} />
      </div>
    </div>
  );
};

export default ItemsPage;
