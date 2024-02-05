import React, { createContext, useContext, useEffect, useState } from 'react'
import CardContext from './CardContext'

const MarketplaceContext = createContext()

export const MarketplaceProvider = ({ children }) => {
  const [listedItems, setListedItems] = useState([])
  const [listedItemsSort, setListedItemsSort] = useState('name asc')
  const [listedItemPriceFilter, setListedItemPriceFilter] = useState('')
  const [listedItemNameFilter, setListedItemNameFilter] = useState('')

  const { sortCardItems } = useContext(CardContext)

  useEffect(() => {
    setListedItems(sortCardItems(listedItems, listedItemsSort))
  }, [listedItemsSort])

  useEffect(() => {
    const fetchListedCardItems = async () => {
      try {
        const response = await fetch('./src/context/listedCards.json')
  
        if(response.ok) {
          const data = await response.json()
    
          setListedItems(sortCardItems(data, listedItemsSort))
        }
      }
      catch(err) {
        console.log(err.message)
      }
    }

    fetchListedCardItems()
  }, [])

  return (
    <MarketplaceContext.Provider value={ { listedItems, setListedItems, listedItemsSort, setListedItemsSort, listedItemPriceFilter, setListedItemPriceFilter, listedItemNameFilter, setListedItemNameFilter } }>{ children }</MarketplaceContext.Provider>
  )
}

export default MarketplaceContext