import React, { createContext, useEffect, useState } from "react";

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  const [listedItems, setListedItems] = useState({ items: [] });
  const [listedItemsSort, setListedItemsSort] = useState("name asc");
  const [listedItemsPriceFilter, setListedItemsPriceFilter] = useState("");
  const [listedItemsNameFilter, setListedItemsNameFilter] = useState("");
  const [listedItemsCurrentPage, setListedItemsCurrentPage] = useState(1);

  useEffect(() => {
    const fetchSortedListedCardItems = async () => {
      try {
        const response = await fetch("http://localhost/php/listedCards.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sort: listedItemsSort,
            priceFilter: listedItemsPriceFilter,
            nameFilter: listedItemsNameFilter,
            currentPage: listedItemsCurrentPage,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          setListedItems(data);

          setListedItemsCurrentPage((oldCurrentPage) => {
            if(oldCurrentPage > data.totalPages || oldCurrentPage === 0) {
              return data.totalPages;
            } 
            else {
              return oldCurrentPage
            }
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchSortedListedCardItems();
  }, [
    listedItemsSort,
    listedItemsPriceFilter,
    listedItemsNameFilter,
    listedItemsCurrentPage,
  ]);

  useEffect(() => {
    const fetchListedCardItems = async () => {
      try {
        const response = await fetch("http://localhost/php/listedCards.php");

        if (response.ok) {
          const data = await response.json();

          setListedItems(data);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchListedCardItems();
  }, []);

  return (
    <MarketplaceContext.Provider
      value={{
        listedItems,
        setListedItems,
        listedItemsSort,
        setListedItemsSort,
        listedItemsPriceFilter,
        setListedItemsPriceFilter,
        listedItemsNameFilter,
        setListedItemsNameFilter,
        listedItemsCurrentPage,
        setListedItemsCurrentPage,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export default MarketplaceContext;
