import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import HeaderContext from './HeaderContext'

const EventsContext = createContext()

export const EventsProvider = ({ children }) => {
  useEffect(() => {
    window.addEventListener('mouseover', (e) => {
      if(e.target.classList.contains('navigation-button')) {
        e.target.classList.add('pointed-navigation-button')
      }
    })

    window.addEventListener('mouseout', (e) => {
      if(e.target.classList.contains('navigation-button')) {
        e.target.classList.remove('pointed-navigation-button')
      }
    })
  }, [])

  return (
    <EventsContext.Provider value={ {  } }>{ children }</EventsContext.Provider>
  )
}

export default EventsContext