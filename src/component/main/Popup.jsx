import React, { useContext } from 'react'
import EventsContext from '../../context/EventsContext'

const Popup = () => {
  const { popupContent, popupConfirmationCallback, popup, popupOverlay, resetPopup } = useContext(EventsContext)

  const handleCancelOnClick = (e) => {
    resetPopup()
  }

  const handleConfirmOnClick = (e) => {
    // invoke the popup callback
    popupConfirmationCallback()

    resetPopup()
  }

  return (
    <>
      <div ref={ popupOverlay } id='popup-overlay' className='hidden-container'></div>

      <article ref={ popup } id='popup-container' className='hidden-container'>
        <h2>Confirmation</h2>

        { popupContent.html }
        
        <form id='popup-form'>
          <fieldset>
            <legend hidden>Confirm</legend>

            <input className='popup-button'type='button' value='Cancel' onClick={ handleCancelOnClick }></input>

            <input className='popup-button'type='button' value='Confirm' onClick={ handleConfirmOnClick }></input>
          </fieldset>
        </form>
      </article>
    </>
  )
}

export default Popup