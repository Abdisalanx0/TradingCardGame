import React, { createContext, useState } from 'react'

const CheckoutContext = createContext()

export const CheckoutProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], count: 0, totalPrice: 0 })

  return (
    <CheckoutContext.Provider value={ { cart, setCart } }>{ children }</CheckoutContext.Provider>
  )
}

export default CheckoutContext