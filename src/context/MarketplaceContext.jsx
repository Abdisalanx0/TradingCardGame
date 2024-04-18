import React, { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import FetchUrl from "./FetchUrl";

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  const [marketplaceCards, setMarketplaceCards] = useState({ cards: [] });
  const [marketplaceCardsSort, setMarketplaceCardsSort] = useState("name asc");
  const [marketplaceCardsPriceFilter, setMarketplaceCardsPriceFilter] = useState("");
  const [marketplaceCardsNameFilter, setMarketplaceCardsNameFilter] = useState("");
  const [marketplaceCardsCurrentPage, setMarketplaceCardsCurrentPage] = useState(1);

  const { username, isLoggedIn } = useContext(AuthContext)

  const fetchMarketplaceCards = async () => {
    if(isLoggedIn) {
      try {
        const response = await fetch(`${FetchUrl}/marketplaceCards.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            sort: marketplaceCardsSort,
            priceFilter: marketplaceCardsPriceFilter,
            nameFilter: marketplaceCardsNameFilter,
            currentPage: marketplaceCardsCurrentPage
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
  
          setMarketplaceCards(data);
  
          setMarketplaceCardsCurrentPage((oldCurrentPage) => {
            if(oldCurrentPage > data.totalPages || oldCurrentPage === 0) {
              return data.totalPages;
            } 
            else {
              return oldCurrentPage;
            }
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  }

  useEffect(() => {
    fetchMarketplaceCards()
  }, [
    marketplaceCardsSort,
    marketplaceCardsPriceFilter,
    marketplaceCardsNameFilter,
    marketplaceCardsCurrentPage,
    isLoggedIn
  ]);

  return (
    <MarketplaceContext.Provider
      value={{
        marketplaceCards,
        setMarketplaceCards,
        marketplaceCardsSort,
        setMarketplaceCardsSort,
        marketplaceCardsPriceFilter,
        setMarketplaceCardsPriceFilter,
        marketplaceCardsNameFilter,
        setMarketplaceCardsNameFilter,
        marketplaceCardsCurrentPage,
        setMarketplaceCardsCurrentPage,
        fetchMarketplaceCards
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export default MarketplaceContext;
