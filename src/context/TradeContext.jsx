import React, { createContext, useContext, useEffect, useState } from 'react'
import AuthContext from './AuthContext'
import FetchUrl from './FetchUrl'
import CardContext from './CardContext'

const TradeContext = createContext()

export const TradeProvider = ({ children }) => {
  const [tradeCards, setTradeCards] = useState({ initiatedTrades: [], receivedTrades: [] })
  const [tradeCardsSort, setTradeCardsSort] = useState("name asc");
  const [tradeCardsPriceFilter, setTradeCardsPriceFilter] = useState("");
  const [tradeCardsNameFilter, setTradeCardsNameFilter] = useState("");
  const [tradeCardsTab, setTradeCardsTab] = useState("Received Requests");
  // step: '' (unstarted), chooseOfferings, chooseRequests, submit
  const [newRequest, setNewRequest] = useState({ offeredCards: [], requestedCards: [], price: 0, step: '', targetUsername: '', targetUserCards: [] })

  const { username, isLoggedIn } = useContext(AuthContext);
  const { sortCards } = useContext(CardContext)

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

  const fetchTargetUserInventoryCards = async (targetUsername) => {
    try {
      const response = await fetch(`${FetchUrl}/userInventory.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: targetUsername })
      })

      if(response.ok) {
        const data = await response.json()

        const nonListedCards = []

        for(let card of data) {
          if(!card.is_listed) {
            nonListedCards.push(card)
          }
        }

        setNewRequest((oldRequest) => {
          const request = { ...oldRequest }

          request.targetUsername = targetUsername
          request.targetUserCards = sortCards(nonListedCards, 'name asc')

          return request
        })
      }
    }
    catch(err) {
      console.log({ message: err.message })
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
    <TradeContext.Provider value={ { tradeCards, setTradeCards, tradeCardsSort, setTradeCardsSort, tradeCardsPriceFilter, setTradeCardsPriceFilter, tradeCardsNameFilter, setTradeCardsNameFilter, tradeCardsTab, setTradeCardsTab, fetchTradeCards, newRequest, setNewRequest, fetchTargetUserInventoryCards } }>{ children }</TradeContext.Provider>
  )
}

export default TradeContext