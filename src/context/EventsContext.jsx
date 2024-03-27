
import React, { createContext, useState, useRef, useEffect } from 'react'

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const [popupContent, setPopupContent] = useState({})
  const [popupConfirmationCallback, setPopupConfirmationCallback] = useState(null)
  const popup = useRef(null)
  const popupOverlay = useRef(null)

  const openPopup = () => {
    popup.current.classList.remove('hidden-container')
    popupOverlay.current.classList.remove('hidden-container')
    popup.current.classList.add('unhidden-container')
    popupOverlay.current.classList.add('unhidden-container')
  }

  const resetPopup = () => {
    // close popup containers
    popup.current.classList.remove('unhidden-container')
    popupOverlay.current.classList.remove('unhidden-container')
    popup.current.classList.add('hidden-container')
    popupOverlay.current.classList.add('hidden-container')
  
    // reset popup state
    setPopupContent({})
    setPopupConfirmationCallback(null)
  }

  useEffect(() => {
    const clickEventCallback = (e) => {
      // if target is the popup overlay
      if(e.target === popupOverlay?.current) {
        resetPopup()
      }
    }

    const mouseOverEventCallback = (e) => {
      if(e.target.classList.contains('navigation-button')) {
        e.target.classList.add('pointed-navigation-button')
      }
    }

    const mouseOutEventCallback = (e) => {
      if(e.target.classList.contains('navigation-button')) {
        e.target.classList.remove('pointed-navigation-button')
      }
    }

    // add event callbacks to listeners
    window.addEventListener('click', clickEventCallback)
    window.addEventListener('mouseover', mouseOverEventCallback)
    window.addEventListener('mouseout', mouseOutEventCallback)
  }, [])

  return (
    <EventsContext.Provider value={ { popupContent, setPopupContent, popupConfirmationCallback, setPopupConfirmationCallback, popup, popupOverlay, openPopup, resetPopup } }>{ children }</EventsContext.Provider>
  )
}


export default EventsContext;
