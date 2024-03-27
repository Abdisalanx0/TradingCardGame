
import React, { createContext, useState, useRef, useEffect } from 'react'

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const [popupContent, setPopupContent] = useState({ html: null, type: '' })
  const [popupConfirmationCallback, setPopupConfirmationCallback] = useState(null)
  const popup = useRef(null)
  const popupOverlay = useRef(null)

  const resetPopup = () => {
    // close popup containers
    popup.current.classList.remove('unhidden-container')
    popupOverlay.current.classList.remove('unhidden-container')
    popup.current.classList.add('hidden-container')
    popupOverlay.current.classList.add('hidden-container')
  
    // reset popup state
    setPopupContent({ html: null, type: '' })
    setPopupConfirmationCallback(null)
  }

  const initiateTradePopupHtml = () => {
    const handleSetTradeRecipientOnClick = (e) => {
      e.preventDefault()
    }

    return (
    <form id='initiate-trade-popup-form'>
      {/* on enter key down submits form (i.e., invokes handleSetTradeRecipientOnClick) */}
      <input id='initiate-trade-username-input' placeholder='enter recipient username'></input>
      <label htmlFor='initiate-trade-username-input'></label>

      <input id='initiate-trade-username-submit' type='submit' onClick={ handleSetTradeRecipientOnClick }></input>
    </form>
    )
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
    <EventsContext.Provider value={ { popupContent, setPopupContent, popupConfirmationCallback, setPopupConfirmationCallback, popup, popupOverlay, resetPopup, initiateTradePopupHtml } }>{ children }</EventsContext.Provider>
  )
}


export default EventsContext;
