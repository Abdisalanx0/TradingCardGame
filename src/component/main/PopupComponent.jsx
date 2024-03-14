import React, { useContext } from 'react'
import EventsContext from '../../context/EventsContext'
import '../../css/main/PopupComponent.css'

const PopupComponent = () => {
  const { popupContent, setPopupContent, popupConfirmationCallback, setPopupConfirmationCallback, popup, popupOverlay } = useContext(EventsContext)

  const resetPopup = () => {
    // close popup containers
    popup.current.classList.add('hidden-container')
    popupOverlay.current.classList.add('hidden-container')
  
    // reset popup state
    setPopupContent({ text: '', type: '' })
    setPopupConfirmationCallback(null)
  }

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
      <div ref={ popupOverlay } id='popup-overlay' className=' hidden-container'></div>

      <article ref={ popup } id='popup-container' className='hidden-container-interactable hidden-container'>
        <h2 className='hidden-container-interactable'>Confirmation</h2>

        <p id='popup-text' className='hidden-container-interactable'>{ popupContent.text }</p>
        
        <form id='popup-form' className='hidden-container-interactable'>
          <fieldset className='hidden-container-interactable'>
            <legend hidden>Confirm</legend>

            <input className='popup-button hidden-container-interactable'type='button' value='Cancel' onClick={ handleCancelOnClick }></input>

            <input className='popup-button hidden-container-interactable'type='button' value='Confirm' onClick={ handleConfirmOnClick }></input>
          </fieldset>
        </form>
      </article>
    </>
  )
}

export default PopupComponent