import React, { createContext, useContext, useEffect, useState } from 'react'
import AuthContext from './AuthContext'

const TradeContext = createContext()

export const TradeProvider = ({ children }) => {
  const [tradeCards, setTradeCards] = useState({ items: [] })
  const [tradeCardsSort, setTradeCardsSort] = useState("name asc");
  const [tradeCardsPriceFilter, setTradeCardsPriceFilter] = useState("");
  const [tradeCardsNameFilter, setTradeCardsNameFilter] = useState("");
  const [tradeCardsCurrentPage, setTradeCardsCurrentPage] = useState(1);
  const { isLoggedIn } = useContext(AuthContext)

  useEffect(() => {
    const fetchSortedTradeCards = async () => {
      try {
        const response = await fetch("http://localhost/php/listedCards.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sort: tradeCardsSort,
            priceFilter: tradeCardsPriceFilter,
            nameFilter: tradeCardsNameFilter,
            currentPage: tradeCardsCurrentPage,
            recipientFilter: sessionStorage.getItem('username')
          }),
        });

        if (response.ok) {
          const data = await response.json();

          setTradeCards(data);

          setTradeCardsCurrentPage((oldCurrentPage) => {
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

    fetchSortedTradeCards();
  }, [
    tradeCardsSort,
    tradeCardsPriceFilter,
    tradeCardsNameFilter,
    tradeCardsCurrentPage,
  ])

  useEffect(() => {
    const fetchTradeCards = async () => {
      const response = await fetch('http://localhost/php/listedCards.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          sort: tradeCardsSort,
          priceFilter: tradeCardsPriceFilter,
          nameFilter: tradeCardsNameFilter,
          currentPage: tradeCardsCurrentPage,
          recipientFilter: sessionStorage.getItem('username') 
        })
      })

      if(response.ok) {
        const data = await response.json()

        setTradeCards(data);

        setTradeCardsCurrentPage((oldCurrentPage) => {
          if (oldCurrentPage > data.totalPages) {
            return data.totalPages;
          } else {
            return oldCurrentPage;
          }
        });
      }
    }
    
    if(isLoggedIn) {
      fetchTradeCards()
    }
  }, [isLoggedIn])

  return (
    <TradeContext.Provider value={ { tradeCards, setTradeCards, tradeCardsSort, setTradeCardsSort, tradeCardsPriceFilter, setTradeCardsPriceFilter, tradeCardsNameFilter, setTradeCardsNameFilter, tradeCardsCurrentPage, setTradeCardsCurrentPage } }>{ children }</TradeContext.Provider>
  )
}

export default TradeContext