import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import ItemModal from "./ItemModal";
import { getItemsByFridgeId } from "../services/api"; //Import API call

function Groceries() {
  const [navBarOpen, setNavBarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); //Controls modal visibility
  const [selectedItem, setSelectedItem] = useState(null); //Stores the item to display via modal
  const [items, setItems] = useState([]); //Managing the list of items
  const fridgeId = 1; //Replace with the correct fridge ID
  const [sortOption, setSortOption] = useState("newest"); //Sorting option

  useEffect(() => {
    //Fetch items from the backend
    const fetchItems = async () => {
      try {
        const response = await getItemsByFridgeId(fridgeId);
        const transformedItems = response.data.map((item) => ({
          id: item.id,
          name: item.name || `Item ${item.id}`,
          image: item.imageURL || "/items/default.png",
          dateExp: formatDateToDDMMYY(item.expirationDate),
          dateAdded: formatDateToDDMMYY(item.addedDate),
        }));
        setItems(transformedItems);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };
    fetchItems();
  }, [fridgeId]);

  const toggleNavBar = () => {
    setNavBarOpen((prev) => !prev);
  };
  const sortItems = (items, option) => {
    const sortedItems = [...items];
    switch (option) {
      case "newest":
        return sortedItems.sort(
          (a, b) =>
            new Date(formatToISO(b.dateAdded)) -
            new Date(formatToISO(a.dateAdded))
        );
      case "oldest":
        return sortedItems.sort(
          (a, b) =>
            new Date(formatToISO(a.dateAdded)) -
            new Date(formatToISO(b.dateAdded))
        );
      case "expiry-soon":
        return sortedItems.sort(
          (a, b) =>
            new Date(formatToISO(a.dateExp)) - new Date(formatToISO(b.dateExp))
        );
      default:
        return sortedItems;
    }
  };
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  const formatToISO = (ddmmyy) => {
    if (!ddmmyy) return null;
    const [day, month, year] = ddmmyy.split("/");
    return `20${year}-${month}-${day}`;
  };

  //Sets the selected item and opens the modal
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  //Handle item updates
  const handleUpdateItem = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  //Handle item removal
  const handleRemoveItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  //Function to calculate days left
  const calculateDaysLeft = (expDate) => {
    if (!expDate) {
      return null;
    }
    const [day, month, year] = expDate.split("/").map(Number);
    const expiration = new Date(2000 + year, month - 1, day);
    const today = new Date();

    expiration.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = expiration - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  //Function to check if the item was added today
  const isItemNew = (dateAdded) => {
    if (!dateAdded) {
      return false;
    }
    const [day, month, year] = dateAdded.split("/").map(Number);
    const addedDate = new Date(2000 + year, month - 1, day);
    const today = new Date();

    addedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return addedDate.getTime() === today.getTime();
  };

  //Function to calculate days since the item was added
  const calculateDaysSinceAdded = (dateAdded) => {
    if (!dateAdded) {
      return null;
    }
    const [day, month, year] = dateAdded.split("/").map(Number);
    const addedDate = new Date(2000 + year, month - 1, day);
    const today = new Date();

    addedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today - addedDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  //Function to transform backend GMT date to DD/MM/YY
  const formatDateToDDMMYY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = String(date.getUTCFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };
  const sortedItems = sortItems(items, sortOption);
  return (
    <div className="bg-gray-100 min-h-screen font-roboto relative overflow-hidden">
      <header className="bg-blue-main text-white">
        <div className="max-w-[1024px] mx-auto p-4 flex justify-between items-center">
          <h1 className="text-3xl">ALL ITEMS</h1>
          <button
            onClick={toggleNavBar}
            className="text-3xl cursor-pointer menu-button"
          >
            {navBarOpen ? "×" : "☰"}
          </button>
        </div>
      </header>

      <div className="max-w-[1024px] mx-auto p-4">
        {/* Dropdown */}
        <div className="flex items-center px-4 py-2 bg-gray-100">
          <label
            htmlFor="sort"
            className="text-lg font-bold text-gray-700 mr-2"
          >
            Sort by:
          </label>
          <select
            id="sort"
            className="border rounded px-3 py-2 bg-white shadow-sm focus:outline-none"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="expiry-soon">Expiring Soon</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
          {sortedItems.map((item) => {
            //Calculate daysLeft and expired dynamically
            const daysLeft = calculateDaysLeft(item.dateExp);
            let expired = daysLeft !== null ? daysLeft < 0 : false;
            //Calculate isNew
            const isNew = isItemNew(item.dateAdded);
            //Determine warning
            let warning = "";
            if (expired) {
              warning = "red";
            } else if (daysLeft !== null && daysLeft >= 0 && daysLeft <= 2) {
              warning = "orange";
            }
            const daysSinceAdded = calculateDaysSinceAdded(item.dateAdded);

            //To dermine if blue warning should be
            const blueWarning = daysSinceAdded !== null && daysSinceAdded > 5;

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`bg-white rounded-lg shadow p-4 relative text-center ${
                  expired
                    ? "border border-red-400"
                    : warning === "orange"
                    ? "border border-orange-400"
                    : blueWarning
                    ? "border border-blue-400"
                    : ""
                } cursor-pointer max-w-52 item`}
              >
                {isNew && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    NEW
                  </div>
                )}

                {/* Warning Badges */}
                {warning === "red" && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    !
                  </div>
                )}
                {warning === "orange" && !expired && (
                  <div
                    className="absolute top-2 right-2
                     bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded"
                  >
                    !
                  </div>
                )}
                {blueWarning && (
                  <div
                    className={`absolute ${
                      warning === "red"
                        ? "top-2 right-8"
                        : warning === "orange"
                        ? "top-2 right-8"
                        : "top-2 right-2"
                    } bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded`}
                  >
                    !
                  </div>
                )}

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-24 object-contain rounded mb-3"
                />
                <p className="font-semibold">{item.name}</p>

                <span className="text-gray-500 text-sm block">
                  {item.dateExp ? item.dateExp : "Expiration N/A"}
                </span>

                <span
                  className={`text-sm font-semibold ${
                    expired
                      ? "text-red-600"
                      : warning === "orange"
                      ? "text-orange-600"
                      : "text-gray-600"
                  }`}
                >
                  {daysLeft !== null
                    ? daysLeft === 0
                      ? "Expires today"
                      : `${Math.abs(daysLeft)} days ${expired ? "ago" : "left"}`
                    : "N/A"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sliding NavBar */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-white transform transition-transform duration-300 ease-in-out ${
          navBarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <NavBar onBackToItems={toggleNavBar} />
      </div>

      {/* Item Modal */}
      {modalOpen && (
        <ItemModal
          item={selectedItem}
          onClose={() => setModalOpen(false)}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
        />
      )}
    </div>
  );
}

export default Groceries;
