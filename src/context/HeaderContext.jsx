import React, { createContext, useState } from 'react'

const HeaderContext = createContext()

export const HeaderProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState('marketplace')

  return (
    <HeaderContext.Provider value={ { currentTab, setCurrentTab } }>{ children }</HeaderContext.Provider>
  )
}

export default HeaderContext