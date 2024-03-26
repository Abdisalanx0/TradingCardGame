import React, { createContext, useContext, useEffect, useState } from "react";
import CardContext from "./CardContext";
import AuthContext from "./AuthContext";

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryItemsSort, setInventoryItemsSort] = useState("name asc");
  const [inventoryItemNameFilter, setInventoryItemNameFilter] = useState("");
  const { sortCardItems } = useContext(CardContext);
  const { isLoggedIn } = useContext(AuthContext);
  useEffect(() => {
    if (isLoggedIn) {
      const fetchInventoryItems = async () => {
        try {
          const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
          };
          const data = { username: sessionStorage.getItem("username") }; // Directly use the username

          // Await the fetch call to ensure it completes before processing the response
          const response = await fetch(
            "http://localhost/php/userInventory.php",
            {
              method: "POST",
              headers,
              body: JSON.stringify(data), // Correctly formatted payload
            }
          );

          // Check if the response is OK before attempting to parse it
          if (response.ok) {
            const responseData = await response.json(); // Await the parsing of the response body
            console.log(responseData);
            setInventoryItems(sortCardItems(responseData, inventoryItemsSort));
          } else {
            // Handle HTTP error responses (e.g., 404, 500)
            console.log(
              "Failed to fetch inventory items. HTTP status: ",
              response.status
            );
          }
        } catch (err) {
          console.error("Error fetching inventory items: ", err.message);
        }
      };

      fetchInventoryItems();
    }
  }, [isLoggedIn]);
  return (
    <InventoryContext.Provider
      value={{
        inventoryItems,
        setInventoryItems,
        inventoryItemsSort,
        setInventoryItemsSort,
        inventoryItemNameFilter,
        setInventoryItemNameFilter,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export default InventoryContext;
