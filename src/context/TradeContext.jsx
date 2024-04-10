import React, { createContext, useContext, useEffect, useState } from 'react'
import AuthContext from './AuthContext'
import FetchUrl from './FetchUrl'

const TradeContext = createContext()

export const TradeProvider = ({ children }) => {
  const [tradeCards, setTradeCards] = useState({ initiatedTrades: [], receivedTrades: [] })
  const [tradeCardsSort, setTradeCardsSort] = useState("name asc");
  const [tradeCardsPriceFilter, setTradeCardsPriceFilter] = useState("");
  const [tradeCardsNameFilter, setTradeCardsNameFilter] = useState("");
  const [tradeCardsTab, setTradeCardsTab] = useState("Received Requests");
  const { username, isLoggedIn } = useContext(AuthContext);

  const fetchTradeCards = async () => {
    if(isLoggedIn) {
      try {
        const response = await fetch(`${FetchUrl}/tradeRequestCards.php`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sort: tradeCardsSort,
            priceFilter: tradeCardsPriceFilter,
            nameFilter: tradeCardsNameFilter,
            username
          })
        })

        if(response.ok) {
          const data = await response.json()

          setTradeCards(data)
        }
      }
      catch(err) {
        console.log({ message: err.message })
      }
    }
  }

  useEffect(() => {
    fetchTradeCards()
  }, [
    tradeCardsSort,
    tradeCardsPriceFilter,
    tradeCardsNameFilter,
    isLoggedIn
  ])

  return (
    <TradeContext.Provider value={ { tradeCards, setTradeCards, tradeCardsSort, setTradeCardsSort, tradeCardsPriceFilter, setTradeCardsPriceFilter, tradeCardsNameFilter, setTradeCardsNameFilter, tradeCardsTab, setTradeCardsTab, fetchTradeCards } }>{ children }</TradeContext.Provider>
  )
}

export default TradeContext