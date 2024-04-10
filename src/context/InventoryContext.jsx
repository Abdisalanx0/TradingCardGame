import React, { createContext, useContext, useEffect, useState } from "react";
import CardContext from "./CardContext";
import AuthContext from "./AuthContext";
import FetchUrl from "./FetchUrl";

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [inventoryCards, setInventoryCards] = useState([]);
  const [inventoryCardsSort, setInventoryCardsSort] = useState("name asc");
  const [inventoryCardNameFilter, setInventoryCardNameFilter] = useState("");
  const { sortCards } = useContext(CardContext);
  const { isLoggedIn } = useContext(AuthContext);

  const fetchInventoryCards = async () => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const data = { username: sessionStorage.getItem("username") }; // Directly use the username

      // Await the fetch call to ensure it completes before processing the response
      const response = await fetch(
        `${FetchUrl}/userInventory.php`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data), // Correctly formatted payload
        }
      );

      // Check if the response is OK before attempting to parse it
      if (response.ok) {
        const responseData = await response.json(); // Await the parsing of the response body
        
        if(Array.isArray(responseData)) {
          setInventoryCards(sortCards(responseData, inventoryCardsSort));
        }
      } else {
        // Handle HTTP error responses (e.g., 404, 500)
        console.log(
          "Failed to fetch inventory cards. HTTP status: ",
          response.status
        );
      }
    }
    catch(err) {
      console.error("Error fetching inventory cards: ", err.message);
    }
  }

  useEffect(() => {
    if(isLoggedIn) {
      fetchInventoryCards()
    }
  }, [isLoggedIn]);

  return (
    <InventoryContext.Provider
      value={{
        inventoryCards,
        setInventoryCards,
        inventoryCardsSort,
        setInventoryCardsSort,
        inventoryCardNameFilter,
        setInventoryCardNameFilter,
        fetchInventoryCards
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export default InventoryContext;
