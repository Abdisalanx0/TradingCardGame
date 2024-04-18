import React, { useContext, useState } from "react";
import EventsContext from "../../context/EventsContext";
import InventoryContext from "../../context/InventoryContext";
import MarketplaceContext from "../../context/MarketplaceContext";

const Inventory = () => {
  const { setPopupContent, setPopupConfirmationCallback, openPopup } = useContext(EventsContext)

  const {
    inventoryCards,
    setInventoryCards,
    setInventoryCardsSort,
    inventoryCardNameFilter,
    setInventoryCardNameFilter,
    listCardOnMarketplace,
    delistCardFromMarketplace
  } = useContext(InventoryContext);

  const { marketplaceCards } = useContext(MarketplaceContext)

  let isAtLeastOneCardVisible = false;

  const generateInventoryCard = (card) => {
    const handleListCardOnClick = (e) => {
      if(e.target.value === 'List on Marketplace') {
        setPopupContent(() => {
          const newContent = {}
  
          newContent.html = 
          <>
            <p>Set price:</p>
  
            <form id='list-card-popup-form'>
  
              {/* on enter key down submits form because it is the first input in the form */}
              <input id='list-card-price-input' type='number' min='0' placeholder='amount' onKeyDown={ (e) => { e.key === 'Enter' ? e.preventDefault() : null } }></input>
              <label htmlFor='list-card-price-input'></label>
            </form>
          </>
  
          return newContent
        })
  
        setPopupConfirmationCallback(() => {
          const callback = () => {
            const price = document.getElementById('list-card-price-input').value

            listCardOnMarketplace(card.id, price)
          }
  
          return callback
        })
      }
      // 'Delist'
      else {
        setPopupContent({ 
          html: <p>Card will be delisted from the marketplace.</p>
        })

        setPopupConfirmationCallback(() => {
          const callback = () => {
            delistCardFromMarketplace(card.id)
          }

          return callback
        })
      }

      openPopup()
    }

    let isVisible = true;

    if (
      !card.name.toLowerCase().includes(inventoryCardNameFilter.toLowerCase())
    ) {
      isVisible = false;
    }

    if (isVisible) {
      isAtLeastOneCardVisible = true;
    }

    return isVisible ? (
      <li
        key={card.id}
        id={`${card.id}-card`}
        className='card'
      >
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

        <form className="card-actions-form">
          { 
            // if card is on the marketplace
            card.listed === 1 ? 
            <label className='card-button-label'>
              <input id={ `${card.id}-card-list-button` } className='card-list-button' type='button' value='Delist' onClick={ handleListCardOnClick }></input>
            </label> :
            // else if card is in a trade 
            card.listed === 2 ? 
            <p className='card-listed-in-trade-note'>Listed in Trade Request</p> :
            // else if card is not listed
            <label className='card-button-label'>
              <input id={ `${card.id}-card-list-button` } className='card-list-button' type='button' value='List on Marketplace' onClick={ handleListCardOnClick }></input>
            </label>
          }
        </form>
      </li>
    ) : null;
  };

  const handleNameFilterOnChange = (e) => {
    setInventoryCardNameFilter(e.target.value);
  };

  const handleSortButtonOnClick = (e) => {
    setInventoryCardsSort((oldSort) => {
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

  return (
    <>
      <form id="filter-and-sort-form">
        <fieldset
          id="name-filter-fieldset"
          className="filter-and-sort-fieldset"
        >
          <legend hidden>Name Filter</legend>

          <input
            id="name-filter-input"
            placeholder="search by card name"
            value={inventoryCardNameFilter}
            onChange={handleNameFilterOnChange}
          ></input>
        </fieldset>

        <fieldset
          id="sort-fieldset"
          className="filter-and-sort-fieldset"
        >
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
            value="Set"
            onClick={handleSortButtonOnClick}
          ></input>
        </fieldset>
      </form>

      <section id="cards-section">
        <h2>Inventory</h2>

        <ul id="cards-ul">
          {inventoryCards.map(generateInventoryCard)}

          {!inventoryCards.length ? <p>No cards to show</p> : null}
        </ul>
      </section>
    </>
  );
};

export default Inventory;
