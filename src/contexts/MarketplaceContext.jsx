import React, { createContext, useEffect, useState } from 'react'

const MarketplaceContext = createContext()

export const MarketplaceProvider = ({ children }) => {
  const [listedCardItems, setListedCardItems] = useState([])
  const [listedCardItemsSort, setListedCardItemsSort] = useState('name asc')
  const [priceFilter, setPriceFilter] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  const sortListedCardItems = (items) => {
    const delimiter = listedCardItemsSort.indexOf(' ')

    const property = listedCardItemsSort.substring(0, delimiter)
    const orientation = listedCardItemsSort.substring(delimiter + 1)

    const orientationMultiplier = orientation === 'asc' ? 1 : -1

    const newItems = items.toSorted((a, b) => {
      let aValue = a[property]
      let bValue = b[property]

      if(property === 'rarity') {
        // if a is common and b is not, or if a is uncommon and b is rare, b has a higher rarity
        if((aValue === 'common' && bValue !== 'common') || (aValue === 'uncommon' && bValue === 'rare')) {
          return -1 * orientationMultiplier
        }
        // else if b is common and a is not, or if b is uncommon and a is rare, a has a higher rarity
        else if((bValue === 'common' && aValue !== 'common') || (bValue === 'uncommon' && aValue === 'rare')) {
          return 1 * orientationMultiplier
        }
        // else if they are the same rarity
        else if(aValue === bValue) {
          return 0
        }
      }
      else {
        if(typeof aValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }
  
        if(aValue < bValue) {
          return -1 * orientationMultiplier
        }
        else if(aValue > bValue) {
          return 1 * orientationMultiplier
        }
        else {
          return 0
        }
      }
    })

    return newItems
  }

  useEffect(() => {
    setListedCardItems(sortListedCardItems(listedCardItems))
  }, [listedCardItemsSort])

  useEffect(() => {
    const fetchListedCardItems = async () => {
      const response = await fetch('./src/contexts/cardItems.json')

      if(response.ok) {
        const data = await response.json()
  
        setListedCardItems(sortListedCardItems(data))
      }
    }

    fetchListedCardItems()
  }, [])

  return (
    <MarketplaceContext.Provider value={ { listedCardItems, setListedCardItems, listedCardItemsSort, setListedCardItemsSort, priceFilter, setPriceFilter, nameFilter, setNameFilter } }>{ children }</MarketplaceContext.Provider>
  )
}

export default MarketplaceContext