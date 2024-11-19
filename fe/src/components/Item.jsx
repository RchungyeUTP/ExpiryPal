import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import itemsData from "../assets/jsons/items.json";

function Item() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = itemsData.items.find((item) => item.id === parseInt(id));

  const [expirationDate, setExpirationDate] = useState(item?.date || "");

  if (!item) {
    return <p className="text-center text-red-500 text-lg">Item not found</p>;
  }

  const handleSave = () => {
    alert("Changes saved!");
  };

  const handleRemove = () => {
    alert("Item removed!");
    navigate("/fridge/groceries");
  };

  return (
    <div className="bg-gray-100 min-h-screen font-roboto relative overflow-hidden">
      {/* Header */}
      <header className="bg-blue-main text-white flex justify-between items-center p-4">
        <button
          onClick={() => navigate("/fridge/groceries")}
          className="absolute left-4 text-3xl cursor-pointer"
        >
          ←
        </button>
        <h1 className="text-3xl mx-auto">{item.name}</h1>
      </header>

      {/* Content */}
      <div className="p-4">
        {/* Image and Basic Info */}
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-contain mb-4"
          />

          {item.isNew && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </div>
          )}
          {item.expired && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              EXPIRED
            </div>
          )}
        </div>

        {/* Item Info */}
        <p className="font-semibold text-xl">{item.name}</p>
        <span className="text-gray-500 text-sm block">Date added: {item.date}</span>
        <span
          className={`text-sm font-semibold ${
            item.expired ? "text-red-600" : "text-gray-600"
          }`}
        >
          {item.daysLeft} days left
        </span>

        {/* Expiration Date */}
        <div className="mt-6">
          <label className="block text-gray-700 font-bold mb-2">Expiration date:</label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="border rounded px-3 py-2 text-center w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-12">
          <button
            onClick={handleRemove}
            className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700"
          >
            Remove Item
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-main text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-800"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Item;
