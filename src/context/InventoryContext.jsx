import React, { createContext, useContext, useEffect, useState } from 'react'
import CardContext from './CardContext'

const InventoryContext = createContext()

export const InventoryProvider = ({ children }) => {
  const [inventoryItems, setInventoryItems] = useState([])
  const [inventoryItemsSort, setInventoryItemsSort] = useState('name asc')
  const [inventoryItemNameFilter, setInventoryItemNameFilter] = useState('')

  const { sortCardItems } = useContext(CardContext)

  useEffect(() => {
    setInventoryItems(sortCardItems(inventoryItems, inventoryItemsSort))
  }, [inventoryItemsSort])

  // initial render
  useEffect(() => {
    const handleFetchInventoryItems = async () => {
      try {
        const response = await fetch('./src/context/inventoryCards.json')
  
        if(response.ok) {
          const data = await response.json()

          setInventoryItems(sortCardItems(data, inventoryItemsSort))
        }
      }
      catch(err) {
        console.log(err.message)
      }
    }

    handleFetchInventoryItems()
  }, [])

  return (
    <InventoryContext.Provider value={ { inventoryItems, setInventoryItems, inventoryItemsSort, setInventoryItemsSort, inventoryItemNameFilter, setInventoryItemNameFilter } }>{ children }</InventoryContext.Provider>
  )
}

export default InventoryContext