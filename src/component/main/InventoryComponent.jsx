import React, { useContext, useState } from "react";
import InventoryContext from "../../context/InventoryContext";
import "../../css/main/InventoryComponent.css";

const InventoryComponent = () => {
  const {
    inventoryItems,
    setInventoryItems,
    setInventoryItemsSort,
    inventoryItemNameFilter,
    setInventoryItemNameFilter,
  } = useContext(InventoryContext);

  let isAtLeastOneCardVisible = false;

  const generateInventoryItem = (item) => {
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
        id={`${item.id}-listed-item`}
        className={`${item.rarity}-item listed-item`}
      >
        <figure className="listed-item-figure">
          <p className="listed-item-rarity-p">{item.rarity}</p>

          <img
            className="listed-item-thumbnail"
            src={`/graphics/${item.image}`}
          ></img>

          <figcaption className="listed-item-name-figcaption">
            {item.name}
          </figcaption>

          <p className="listed-item-description-p" title={item.description}>
            {item.description}
          </p>
        </figure>

        <form className="listed-item-add-to-cart-form">
          <label className="listed-item-add-to-cart-button-label"></label>
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
      <form id="inv-filter-and-sort-form">
        <fieldset
          id="inv-name-filter-fieldset"
          className="inv-filter-and-sort-fieldset"
        >
          <legend hidden>Name Filter</legend>

          <input
            id="inv-name-filter-input"
            placeholder="search by card name"
            value={inventoryItemNameFilter}
            onChange={handleNameFilterOnChange}
          ></input>
        </fieldset>

        <fieldset
          id="inv-sort-fieldset"
          className="inv-filter-and-sort-fieldset"
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

      <section id="inventory-items-section">
        <h2>Inventory</h2>

        <ul id="inventory-items-ul">
          {inventoryItems.map(generateInventoryItem)}
        </ul>
      </section>
    </>
  );
};

export default InventoryComponent;
