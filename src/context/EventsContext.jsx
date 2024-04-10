
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

    // add event callback to listener
    window.addEventListener('click', clickEventCallback)
  }, [])

  return (
    <EventsContext.Provider value={ { popupContent, setPopupContent, popupConfirmationCallback, setPopupConfirmationCallback, popup, popupOverlay, openPopup, resetPopup } }>{ children }</EventsContext.Provider>
  )
}


export default EventsContext;
