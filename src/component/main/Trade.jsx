import React, { useContext } from 'react'
import TradeContext from '../../context/TradeContext'
import CardContext from '../../context/CardContext'
import AuthContext from '../../context/AuthContext'
import EventsContext from '../../context/EventsContext'

const Trade = () => {
  const { 
    tradeCards, 
    setTradeCardsSort, 
    tradeCardsPriceFilter, 
    setTradeCardsPriceFilter, 
    tradeCardsNameFilter, 
    setTradeCardsNameFilter,
    tradeCardsTab, 
    setTradeCardsTab, 
    newRequest, 
    setNewRequest,
    addCardToRequestedCards,
    addCardToOfferedCards,
    removeCardFromRequestedCards,
    removeCardFromOfferedCards,
    fetchTradeableCards,
    createRequest,
    acceptRequest,
    removeRequest
  } = useContext(TradeContext)

  const { sortCards } = useContext(CardContext)
  const { username } = useContext(AuthContext)
  const { setPopupContent, setPopupConfirmationCallback, openPopup } = useContext(EventsContext)

  const handleRequestActionOnClick = (e) => {
    const requestId = e.target.id.substring(0, e.target.id.indexOf('-'))

    let callback = () => {}

    if(e.target.value === 'Accept Trade') {
      callback = () => {
        acceptRequest(requestId)
      }

      setPopupContent({ html: <p>Request will be accepted.</p> })
    }
    else if(e.target.value === 'Reject Trade') {
      callback = () => {
        removeRequest(requestId)
      }

      setPopupContent({ html: <p>Request will be rejected.</p> })
    }
    else if(e.target.value === 'Cancel Trade') {
      callback = () => {
        removeRequest(requestId)
      }

      setPopupContent({ html: <p>Request will be canceled.</p> })
    }

    setPopupConfirmationCallback(() => callback)
    openPopup()
  }

  // generated offeredCards and requestedCards
  const generateTradeCard = (card) => {
    return (
      <li key={ card.id } id={ `${card.id}-trade-card` } className='mini-card'>
        <figure className="card-figure">
          <p className="card-set-p">{card.card_set}</p>

          <img
            className="card-thumbnail"
            src={`/graphics/${card.image}`}
          ></img>

          <figcaption className="card-name-figcaption">
            {card.name}
          </figcaption>

          <p className="card-description-p" title={card.description}>
            {card.description}
          </p>
        </figure>
      </li>
    )
  }

  // generated sent requests and offered requests
  const generateTradeRequest = (request) => {
    return (
      <li key={ request.id } id={ `${request.id}-trade-request` } className='trade-request'>
        <details>
          <summary>
            { 
              tradeCardsTab === 'Received Requests' ? 
              <p>From { request.initiatorUsername }</p> :
              <p>To { request.targetUsername }</p>
            }

            <p>Offered Price: { request.offeredPrice } CZ</p>
            <p>Requested Price: { request.requestedPrice } CZ</p>
          </summary>

          <section className='request-cards-section'>
            <section className='offered-cards-section'>
              <h3>Offered Cards</h3>

              <ul className='offered-cards-ul'>
                { request.offeredCards.map(generateTradeCard) }
                
                { !request.offeredCards.length ? <li>No cards to show</li> : null }
              </ul>
            </section>

            <section className='requested-cards-section'>
              <h3>Requested Cards</h3>

              <ul className='requested-cards-ul'>
                { request.requestedCards.map(generateTradeCard) }

                { !request.requestedCards.length ? <li>No cards to show</li> : null }
              </ul>
            </section>
          </section>

          <form className="request-actions-form">
              { 
                tradeCardsTab === 'Received Requests' ?
                <>
                  <label className="request-button-label">
                    <input
                      id={`${request.id}-reject-request-button`}
                      className="card-request-button"
                      type="button"
                      value="Reject Trade"
                      onClick={handleRequestActionOnClick}
                    ></input>
                  </label>

                  <label className="request-button-label">
                    <input
                      id={`${request.id}-accept-request-button`}
                      className="card-request-button"
                      type="button"
                      value="Accept Trade"
                      onClick={handleRequestActionOnClick}
                    ></input>
                  </label>
                </> :
                <>
                  <label className="request-button-label">
                    <input
                      id={`${request.id}-cancel-request-button`}
                      className="card-request-button"
                      type="button"
                      value="Cancel Trade"
                      onClick={handleRequestActionOnClick}
                    ></input>
                  </label>
                </>
              }
          </form>
        </details>
      </li>
    )
  }

  const handleNameFilterOnChange = (e) => {
    setTradeCardsNameFilter(e.target.value);
  };

  const handleNameFilterOnKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleSortButtonOnClick = (e) => {
    setTradeCardsSort((oldSort) => {
      const delimiter = oldSort.indexOf(" ");

      let property = oldSort.substring(0, delimiter);
      let orientation = oldSort.substring(delimiter + 1);

      if (e.target.value === "Name") {
        if (property === "name" && orientation === "asc") {
          orientation = "des";
        } else {
          property = "name";
          orientation = "asc";
        }
      } else if (e.target.value === "Set") {
        if (property === "card_set" && orientation === "asc") {
          orientation = "des";
        } else {
          property = "card_set";
          orientation = "asc";
        }
      }

      return `${property} ${orientation}`;
    });
  };

  const handleTradeTabOnClick = (e) => {
    setTradeCardsTab(e.target.value)
  }

  const handleTargetUserSearchOnClick = async (e) => {
    e.preventDefault()

    const targetInput = document.getElementById('request-target-username-input')

    if(targetInput.value !== username) {
      const cards = await fetchTradeableCards(targetInput.value)

      setNewRequest((oldRequest) => {
        const request = { ...oldRequest }

        request.targetUsername = targetInput.value
        request.targetUserCards = sortCards(cards, 'name asc')

        return request
      })
    }
  }

  const handleTargetUserSearchInputOnKeyDown = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault()

      handleTargetUserSearchOnClick(e)
    }
  }

  const handleAddToRequestedCardsOnClick = (e) => {
    const delimiterIndex = e.target.id.indexOf("-add-to-requested-cards-button");
    const cardId = Number(e.target.id.substring(0, delimiterIndex));

    if (e.target.value === "Add") {
      for (let card of newRequest.targetUserCards) {
        if (card.id === cardId) {
          addCardToRequestedCards(card)

          break;
        }
      }
    } else if (e.target.value === "Remove") {
      removeCardFromRequestedCards(cardId)
    }
  }

  const handleAddToOfferedCardsOnClick = (e) => {
    const delimiterIndex = e.target.id.indexOf("-add-to-offered-cards-button");
    const cardId = Number(e.target.id.substring(0, delimiterIndex));

    if (e.target.value === "Add") {
      for (let card of newRequest.userCards) {
        if (card.id === cardId) {
          addCardToOfferedCards(card)

          break;
        }
      }
    } else if (e.target.value === "Remove") {
      removeCardFromOfferedCards(cardId)
    }
  }

  const generateTargetUserCards = (card) => {
    return (
      <li key={ card.id } id={ `${card.id}-trade-card` } className='mini-card'>
        <figure className="card-figure">
          <p className="card-set-p">{card.card_set}</p>

          <img
            className="card-thumbnail"
            src={`/graphics/${card.image}`}
          ></img>

          <figcaption className="card-name-figcaption">
            {card.name}
          </figcaption>

          <p className="card-description-p" title={card.description}>
            {card.description}
          </p>
        </figure>

        <label className='card-button-label'>
          <input 
            id={ `${card.id}-add-to-requested-cards-button` }
            className='card-add-to-request-button'
            type='button'
            value={
              newRequest.requestedCards.some((selectedCard) => selectedCard.id === card.id)
              ? "Remove"
              : "Add"
            }
            onClick={ handleAddToRequestedCardsOnClick }
          ></input>
        </label>
      </li>
    )
  }

  const generateInventoryCards = (card) => {
    if(card.listed === 0) {
      return (
        <li key={ card.id } id={ `${card.id}-trade-card` } className='mini-card'>
          <figure className="card-figure">
            <p className="card-set-p">{card.card_set}</p>
  
            <img
              className="card-thumbnail"
              src={`/graphics/${card.image}`}
            ></img>
  
            <figcaption className="card-name-figcaption">
              {card.name}
            </figcaption>
  
            <p className="card-description-p" title={card.description}>
              {card.description}
            </p>
          </figure>
  
          <label className='card-button-label'>
            <input 
              id={ `${card.id}-add-to-offered-cards-button` }
              className='card-add-to-request-button'
              type='button'
              value={
                newRequest.offeredCards.some((selectedCard) => selectedCard.id === card.id)
                ? "Remove"
                : "Add"
              }
              onClick={ handleAddToOfferedCardsOnClick }
            ></input>
          </label>
        </li>
      )
    }
  }

  const handleNewRequestSubmitOnClick = (e) => {
    e.preventDefault()

    const requestPriceInput = document.getElementById('request-price-input')

    const callback = () => {
      createRequest(requestPriceInput.value)
    }

    setPopupContent({ html: <p>Trade Request will be created.</p> })
    setPopupConfirmationCallback(() => callback)
    openPopup()
  }

  const handlePriceTypeButtonOnClick = (e) => {
    setNewRequest((oldRequest) => {
      const request = { ...oldRequest, priceType: e.target.value === 'Offer Coins:' ? 'requested' : 'offered' }

      return request
    })
  }

  return (
    <>
      <nav id='trade-cards-navigation-container'>
        <input className={ (tradeCardsTab === 'Received Requests' ? 'current-trade-cards-tab-button ' : '') + 'trade-cards-tab-button' } type='button' value='Received Requests' onClick={ handleTradeTabOnClick }></input>
        <input className={ (tradeCardsTab === 'Sent Requests' ? 'current-trade-cards-tab-button ' : '') + 'trade-cards-tab-button' } type='button' value='Sent Requests' onClick={ handleTradeTabOnClick }></input>
        <input className={ (tradeCardsTab === 'Create Request' ? 'current-trade-cards-tab-button ' : '') + 'trade-cards-tab-button' } type='button' value='Create Request' onClick={ handleTradeTabOnClick }></input>
      </nav>

      <section id='requests-section'>
        <h2 hidden>Trade Requests</h2>

        <ul id='requests-ul'>
          { 
            tradeCardsTab === 'Received Requests' ?
            <>
              { tradeCards.receivedTrades.map(generateTradeRequest) }

              { !tradeCards.receivedTrades.length ? <li>No requests to show</li> : null }
            </> : tradeCardsTab === 'Sent Requests' ? 
            <>
              { tradeCards.initiatedTrades.map(generateTradeRequest) }
              
              { !tradeCards.initiatedTrades.length ? <li>No requests to show</li> : null }
            </> :
            <li>
              <form>
                <fieldset id='new-request-target-user-search-fieldset'>
                  <legend>Search for User</legend>

                  <input id='request-target-username-input' placeholder='enter username' onKeyDown={ handleTargetUserSearchInputOnKeyDown }></input>
                  <label hidden htmlFor='request-target-username-input'>Enter Username</label>

                  <input id='request-target-username-submit-button' type='button' value='Search' onClick={ handleTargetUserSearchOnClick }></input>
                </fieldset>

                <fieldset id='new-request-select-requested-cards-fieldset'>
                  <legend>Select Requested Cards</legend>

                  <ul id='new-request-target-user-cards-ul'>
                    { newRequest.targetUserCards.map(generateTargetUserCards) }

                    { !newRequest.targetUserCards.length ? <p>No cards to show</p> : null }
                  </ul>
                </fieldset>

                <fieldset id='new-request-select-offered-cards-fieldset'>
                  <legend>Select Offered Cards</legend>

                  <ul id='new-request-inventory-cards-ul'>
                    { newRequest.userCards.map(generateInventoryCards) }

                    { !newRequest.userCards.length ? <p>No cards to show</p> : null }
                  </ul>
                </fieldset>

                <fieldset id='new-request-add-price-fieldset'>
                  <legend>Add Price</legend>

                  <input id='request-price-type-button' type='button' value={ newRequest.priceType === 'offered' ? 'Offer Coins:': 'Request Coins:' } onClick={ handlePriceTypeButtonOnClick }></input>

                  <input id='request-price-input' type='number' min='0' placeholder='amount'></input>
                  <label hidden htmlFor='request-price-input'>Enter Price</label>
                </fieldset>

                <fieldset id='new-request-submit-fieldset'>
                  <input id='new-request-submit-button' type='submit' onClick={ handleNewRequestSubmitOnClick }></input>
                </fieldset>
              </form>
            </li>
          }
        </ul>
      </section>
    </>
  )
}

export default Trade