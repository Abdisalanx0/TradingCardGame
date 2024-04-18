import React, { createContext, useContext, useEffect, useState } from 'react'
import AuthContext from './AuthContext'
import FetchUrl from './FetchUrl'
import CardContext from './CardContext'
import InventoryContext from './InventoryContext'
import HeaderContext from './HeaderContext'

const TradeContext = createContext()

export const TradeProvider = ({ children }) => {
  const [tradeCards, setTradeCards] = useState({ initiatedTrades: [], receivedTrades: [] })
  const [tradeCardsSort, setTradeCardsSort] = useState("name asc");
  const [tradeCardsPriceFilter, setTradeCardsPriceFilter] = useState("");
  const [tradeCardsNameFilter, setTradeCardsNameFilter] = useState("");
  const [tradeCardsTab, setTradeCardsTab] = useState("Received Requests");
  const [newRequest, setNewRequest] = useState({ offeredCards: [], requestedCards: [], targetUsername: '', priceType: 'offered', userCards: [], targetUserCards: [] })

  const { username, isLoggedIn, fetchUserInfo } = useContext(AuthContext);
  const { sortCards } = useContext(CardContext)
  const { fetchInventoryCards } = useContext(InventoryContext)
  const { currentTab } = useContext(HeaderContext)
  
  const addCardToRequestedCards = (card) => {
    setNewRequest((oldRequest) => {
      const request = { ...oldRequest, requestedCards: [...oldRequest.requestedCards, card] }

      return request
    })
  }

  const addCardToOfferedCards = (card) => {
    setNewRequest((oldRequest) => {
      const request = { ...oldRequest, offeredCards: [...oldRequest.offeredCards, card] }

      return request
    })
  }

  const removeCardFromRequestedCards = (cardId) => {
    setNewRequest((oldRequest) => {
      const request = {
        ...oldRequest, 
        requestedCards: []
      }

      for(let i = 0; i < oldRequest.requestedCards.length; i++) {
        if(oldRequest.requestedCards[i].id !== cardId) {
          request.requestedCards.push(oldRequest.requestedCards[i])
        }
      }

      return request
    })
  }

  const removeCardFromOfferedCards = (cardId) => {
    setNewRequest((oldRequest) => {
      const request = {
        ...oldRequest, 
        offeredCards: []
      }

      for(let i = 0; i < oldRequest.offeredCards.length; i++) {
        if(oldRequest.offeredCards[i].id !== cardId) {
          request.offeredCards.push(oldRequest.offeredCards[i])
        }
      }

      return request
    })
  }

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
        console.log(err.message)
      }
    }
  }

  // fetch a user's unlisted inventory cards
  const fetchTradeableCards = async (targetUsername) => {
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

        if(data.success !== false) {
          for(let card of data) {
            if(card.listed === 0) {
              nonListedCards.push(card)
            }
          }
        }

        return nonListedCards
      }
    }
    catch(err) {
      console.log(err.message)
    }
  }

  const createRequest = async (price) => {
    // require a target username and either offered cards or requested cards
    if(newRequest.targetUsername && (newRequest.requestedCards.length || newRequest.offeredCards.length)) {
      try {
        const response = await fetch(`${FetchUrl}/createTradeRequest.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            username, 
            targetUsername: newRequest.targetUsername,
            offeredCards: newRequest.offeredCards, 
            requestedCards: newRequest.requestedCards,
            offeredPrice: newRequest.priceType === 'offered' ? price : 0,
            requestedPrice: newRequest.priceType === 'requested' ? price : 0
          })
        })
  
        if(response.ok) {
          const cards = await fetchTradeableCards(username)
          setNewRequest({ offeredCards: [], requestedCards: [], priceType: 'offered', targetUsername: '', userCards: sortCards(cards, 'name asc'), targetUserCards: [] })

          // update trade requests and inventory cards
          fetchTradeCards()
          fetchInventoryCards()
        }
      }
      catch(err) {
        console.log(err.message)
      }
    }
  }

  const acceptRequest = async (requestId) => {
    try {
      const response = await fetch(`${FetchUrl}/acceptTradeRequest.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestId })
      })

      if(response.ok) {
        // update trade requests and inventory cards
        fetchUserInfo()
        fetchTradeCards()
        fetchInventoryCards()
      }
    }
    catch(err) {
      console.log(err.message)
    }
  }

  const removeRequest = async (requestId) => {
    try {
      const response = await fetch(`${FetchUrl}/removeTradeRequest.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestId })
      })

      if(response.ok) {
        // update trade requests and inventory cards
        fetchTradeCards()
        fetchInventoryCards()
      }
    }
    catch(err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    const handleIsLoggedInChange = async () => {
      if(isLoggedIn) {
        const cards = await fetchTradeableCards(username)

        setNewRequest((oldRequest) => {
          const request = { ...oldRequest }
  
          request.userCards = sortCards(cards, 'name asc')
  
          return request
        })
      }
    }

    fetchTradeCards()
    handleIsLoggedInChange()
  }, [
    tradeCardsSort,
    tradeCardsPriceFilter,
    tradeCardsNameFilter,
    isLoggedIn,
    currentTab
  ])

  return (
    <TradeContext.Provider value={ { 
      tradeCards, 
      setTradeCards, 
      tradeCardsSort, 
      setTradeCardsSort, 
      tradeCardsPriceFilter, 
      setTradeCardsPriceFilter, 
      tradeCardsNameFilter, 
      setTradeCardsNameFilter, 
      tradeCardsTab, 
      setTradeCardsTab, 
      newRequest, 
      setNewRequest, 
      addCardToRequestedCards,
      addCardToOfferedCards,
      removeCardFromRequestedCards,
      removeCardFromOfferedCards,
      fetchTradeCards, 
      fetchTradeableCards,
      createRequest,
      acceptRequest,
      removeRequest
    } }>{ children }</TradeContext.Provider>
  )
}

export default TradeContext