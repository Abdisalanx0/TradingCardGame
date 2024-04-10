import React, { useContext } from 'react'
import TradeContext from '../../context/TradeContext'

const Trade = () => {
  const { tradeCards, setTradeCardsSort, tradeCardsPriceFilter, setTradeCardsPriceFilter, tradeCardsNameFilter, setTradeCardsNameFilter, tradeCardsTab, setTradeCardsTab } = useContext(TradeContext)

  const handleRequestActionOnClick = (e) => {
    if(e.target.value === 'Accept Trade') {

    }
    else if(e.target.value === 'Reject Trade') {

    }
    else if(e.target.value === 'Cancel Trade') {

    }
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

            <p>Price: { request.price } CZ</p>
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
                      id={`${request.id}-request-button`}
                      className="card-request-button"
                      type="button"
                      value="Reject Trade"
                      onClick={handleRequestActionOnClick}
                    ></input>
                  </label>

                  <label className="request-button-label">
                    <input
                      id={`${request.id}-request-button`}
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
                      id={`${request.id}-request-button`}
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

  const handlePriceFilterOnClick = (e) => {
    if (e.target.id === "0-50-price-filter-radio") {
      setTradeCardsPriceFilter("0-50");
    } else if (e.target.id === "50-100-price-filter-radio") {
      setTradeCardsPriceFilter("50-100");
    } else if (e.target.id === "100-1000-price-filter-radio") {
      setTradeCardsPriceFilter("100-1000");
    } else if (e.target.id === "all-price-filter-radio") {
      setTradeCardsPriceFilter("");
    }
  };

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
      } else if (e.target.value === "Price") {
        if (property === "price" && orientation === "asc") {
          orientation = "des";
        } else {
          property = "price";
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

  return (
    <>
      <form id="filter-and-sort-form">
        <fieldset
          id="price-filter-fieldset"
          className="filter-and-sort-fieldset"
        >
          <legend>Price Filter</legend>

          <label>
            <input
              id="0-50-price-filter-radio"
              type="radio"
              name="price-filter-radio"
              onClick={handlePriceFilterOnClick}
              defaultChecked={tradeCardsPriceFilter === "0-50"}
            ></input>
            0-50 CZ
          </label>

          <label>
            <input
              id="50-100-price-filter-radio"
              type="radio"
              name="price-filter-radio"
              onClick={handlePriceFilterOnClick}
              defaultChecked={tradeCardsPriceFilter === "50-100"}
            ></input>
            50-100 CZ
          </label>

          <label>
            <input
              id="100-1000-price-filter-radio"
              type="radio"
              name="price-filter-radio"
              onClick={handlePriceFilterOnClick}
              defaultChecked={tradeCardsPriceFilter === "100-1000"}
            ></input>
            100-1000 CZ
          </label>

          <label>
            <input
              id="all-price-filter-radio"
              type="radio"
              name="price-filter-radio"
              onClick={handlePriceFilterOnClick}
              defaultChecked={tradeCardsPriceFilter === ""}
            ></input>
            All Prices
          </label>
        </fieldset>

        <fieldset
          id="name-filter-fieldset"
          className="filter-and-sort-fieldset"
        >
          <legend hidden>Name Filter</legend>

          <input
            id="name-filter-input"
            placeholder="search by card name"
            value={tradeCardsNameFilter}
            onChange={handleNameFilterOnChange}
            onKeyDown={handleNameFilterOnKeyDown}
          ></input>
        </fieldset>

        <fieldset id="sort-fieldset" className="filter-and-sort-fieldset">
          <legend>Sort</legend>

          <input
            className="sort-button"
            type="button"
            value="Name"
            onClick={handleSortButtonOnClick}
          ></input>

          <input
            className="sort-button"
            type="button"
            value="Price"
            onClick={handleSortButtonOnClick}
          ></input>

          <input
            className="sort-button"
            type="button"
            value="Set"
            onClick={handleSortButtonOnClick}
          ></input>
        </fieldset>
      </form>

      <section id='requests-section'>
        <h2 hidden>Trade Requests</h2>

        <nav id='trade-cards-navigation-container'>
          <input className={ (tradeCardsTab === 'Received Requests' ? 'current-trade-cards-tab-button ' : '') + 'trade-cards-tab-button' } type='button' value='Received Requests' onClick={ handleTradeTabOnClick }></input>
          <input className={ (tradeCardsTab === 'Sent Requests' ? 'current-trade-cards-tab-button ' : '') + 'trade-cards-tab-button' } type='button' value='Sent Requests' onClick={ handleTradeTabOnClick }></input>
        </nav>

        <ul id='requests-ul'>
          { 
            tradeCardsTab === 'Received Requests' ?
            <>
              { tradeCards.receivedTrades.map(generateTradeRequest) }

              { !tradeCards.receivedTrades.length ? <li>No requests to show</li> : null }
            </> : 
            <>
              { tradeCards.initiatedTrades.map(generateTradeRequest) }
              
              { !tradeCards.initiatedTrades.length ? <li>No requests to show</li> : null }
            </>
          }
        </ul>
      </section>
    </>
  )
}

export default Trade