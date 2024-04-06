import React, { useContext, useState } from "react";
import EventsContext from "../../context/EventsContext";
import InventoryContext from "../../context/InventoryContext";

const InventoryComponent = () => {
  const { setPopupContent, setPopupConfirmationCallback, openPopup } = useContext(EventsContext)

  const {
    inventoryItems,
    setInventoryItems,
    setInventoryItemsSort,
    inventoryItemNameFilter,
    setInventoryItemNameFilter,
  } = useContext(InventoryContext);

  let isAtLeastOneCardVisible = false;

  const generateInventoryItem = (item) => {
    const handleTradeCardOnClick = (e) => {
      setPopupContent(() => {
        const newContent = {}

        newContent.html = 
        <>
          <p>Set a recipient and price.</p>
          <form id='initiate-trade-popup-form'>

            {/* on enter key down submits form because it is the first input in the form */}
            <input id='initiate-trade-username-input' placeholder='enter recipient username' onKeyDown={ (e) => { e.key === 'Enter' ? e.preventDefault() : null } }></input>
            <label htmlFor='initiate-trade-username-input'></label>
    
            <input id='initiate-trade-price-input' placeholder='enter trade price'></input>
            <label htmlFor='initiate-trade-price-input'></label>
          </form>
        </>

        return newContent
      })

      setPopupConfirmationCallback(() => {
        const callback = () => {
          // code to initiate tade request to designated user

          const recipient = document.getElementById('initiate-trade-username-input').value
          const price = document.getElementById('initiate-trade-price-input').value

          console.log(`Trade request sent to ${recipient} for $${price}.`)
        }

        return callback
      })

      openPopup()
    }

    let isVisible = true;

    if (
      !item.name.toLowerCase().includes(inventoryItemNameFilter.toLowerCase())
    ) {
      isVisible = false;
    }

    if (isVisible) {
      isAtLeastOneCardVisible = true;
    }

    return isVisible ? (
      <li
        key={item.id}
        id={`${item.id}-card`}
        className={`${item.rarity}-card card`}
      >
        <figure className="card-figure">
          <p className="card-rarity-p">{item.rarity}</p>

          <img
            className="card-thumbnail"
            src={`/graphics/${item.image}`}
          ></img>

          <figcaption className="card-name-figcaption">
            {item.name}
          </figcaption>

          <p className="card-description-p" title={item.description}>
            {item.description}
          </p>
        </figure>

        <form className="card-actions-form">
          <label className='card-button-label'>
            <input id={ `${item.id}-card-trade-button` } className='card-trade-button' type='button' value='Trade' onClick={ handleTradeCardOnClick }></input>
          </label>
        </form>
      </li>
    ) : null;
  };

  const handleNameFilterOnChange = (e) => {
    setInventoryItemNameFilter(e.target.value);
  };

  const handleSortButtonOnClick = (e) => {
    setInventoryItemsSort((oldSort) => {
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
      } else if (e.target.value === "Rarity") {
        if (property === "rarity" && orientation === "asc") {
          orientation = "des";
        } else {
          property = "rarity";
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
            value={inventoryItemNameFilter}
            onChange={handleNameFilterOnChange}
          ></input>
        </fieldset>

        <fieldset
          id="sort-fieldset"
          className="filter-and-sort-fieldset"
        >
          <legend>Sort</legend>

          <input
            type="button"
            value="Name"
            onClick={handleSortButtonOnClick}
          ></input>

          <input
            type="button"
            value="Rarity"
            onClick={handleSortButtonOnClick}
          ></input>
        </fieldset>
      </form>

      <section id="cards-section">
        <h2>Inventory</h2>

        <ul id="cards-ul">
          {inventoryItems.map(generateInventoryItem)}

          {!inventoryItems.length ? <p>No items to show</p> : null}
        </ul>
      </section>
    </>
  );
};

export default InventoryComponent;
