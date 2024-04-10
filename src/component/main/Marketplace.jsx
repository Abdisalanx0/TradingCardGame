import React, { useContext } from "react";
import MarketplaceContext from "../../context/MarketplaceContext";
import CheckoutContext from "../../context/CheckoutContext";

const Marketplace = () => {
  const {
    marketplaceCards,
    setMarketplaceCardsSort,
    marketplaceCardsPriceFilter,
    setMarketplaceCardsPriceFilter,
    marketplaceCardsNameFilter,
    setMarketplaceCardsNameFilter,
    marketplaceCardsCurrentPage,
    setMarketplaceCardsCurrentPage,
  } = useContext(MarketplaceContext);
  const { cart, addCardToCart, removeCardFromCart } = useContext(CheckoutContext);

  const handleAddToCartOnClick = (e) => {
    const delimiterIndex = e.target.id.indexOf("-add-to-cart-button");
    const cardId = Number(e.target.id.substring(0, delimiterIndex));

    if (e.target.value === "Add to Cart") {
      for (let card of marketplaceCards.cards) {
        if (card.id === cardId) {
          addCardToCart(card)

          break;
        }
      }
    } else if (e.target.value === "Remove from Cart") {
      removeCardFromCart(cardId)
    }
  };

  const generateMarketplaceCards = (card) => {
    return (
      <li
        key={card.id}
        id={`${card.id}-marketplace-card`}
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
          <label className="card-button-label">
            <p className="card-price">{card.price} CZ</p>
            <input
              id={`${card.id}-add-to-cart-button`}
              className="card-add-to-cart-button"
              type="button"
              value={
                cart.cards.some((cartCard) => cartCard.id === card.id)
                  ? "Remove from Cart"
                  : "Add to Cart"
              }
              onClick={handleAddToCartOnClick}
            ></input>
          </label>
        </form>
      </li>
    );
  };

  const handlePriceFilterOnClick = (e) => {
    if (e.target.id === "0-50-price-filter-radio") {
      setMarketplaceCardsPriceFilter("0-50");
    } else if (e.target.id === "50-100-price-filter-radio") {
      setMarketplaceCardsPriceFilter("50-100");
    } else if (e.target.id === "100-1000-price-filter-radio") {
      setMarketplaceCardsPriceFilter("100-1000");
    } else if (e.target.id === "all-price-filter-radio") {
      setMarketplaceCardsPriceFilter("");
    }
  };

  const handleNameFilterOnChange = (e) => {
    setMarketplaceCardsNameFilter(e.target.value);
  };

  const handleNameFilterOnKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleSortButtonOnClick = (e) => {
    setMarketplaceCardsSort((oldSort) => {
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

  const handlePageButtonOnClick = (e) => {
    if (e.target.value === "Previous" && marketplaceCardsCurrentPage > 1) {
      setMarketplaceCardsCurrentPage(marketplaceCardsCurrentPage - 1);
    } else if (
      e.target.value === "Next" &&
      marketplaceCardsCurrentPage < marketplaceCards.totalPages
    ) {
      setMarketplaceCardsCurrentPage(marketplaceCardsCurrentPage + 1);
    }
  };

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
              defaultChecked={marketplaceCardsPriceFilter === "0-50"}
            ></input>
            0-50 CZ
          </label>

          <label>
            <input
              id="50-100-price-filter-radio"
              type="radio"
              name="price-filter-radio"
              onClick={handlePriceFilterOnClick}
              defaultChecked={marketplaceCardsPriceFilter === "50-100"}
            ></input>
            50-100 CZ
          </label>

          <label>
            <input
              id="100-1000-price-filter-radio"
              type="radio"
              name="price-filter-radio"
              onClick={handlePriceFilterOnClick}
              defaultChecked={marketplaceCardsPriceFilter === "100-1000"}
            ></input>
            100-1000 CZ
          </label>

          <label>
            <input
              id="all-price-filter-radio"
              type="radio"
              name="price-filter-radio"
              onClick={handlePriceFilterOnClick}
              defaultChecked={marketplaceCardsPriceFilter === ""}
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
            value={marketplaceCardsNameFilter}
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

        <fieldset id="page-selection-fieldset">
          <legend>Page</legend>

          <div className="overlayed-button-container">
            {/* src: /icons/arrow-back.svg */}
            <svg
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
            </svg>

            <input
              className="pagination-button overlayed-button"
              type="button"
              value="Previous"
              onClick={handlePageButtonOnClick}
            ></input>
          </div>

          <p>
            {marketplaceCardsCurrentPage} of {marketplaceCards.totalPages}
          </p>

          <div className="overlayed-button-container">
            {/* src: /icons/arrow-forward.svg */}
            <svg
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
            </svg>

            <input
              className="pagination-button overlayed-button"
              type="button"
              value="Next"
              onClick={handlePageButtonOnClick}
            ></input>
          </div>
        </fieldset>
      </form>

      <section id="cards-section">
        <h2>Listed Trading Cards</h2>

        <ul id="cards-ul">
          {marketplaceCards.cards.map(generateMarketplaceCards)}

          {!marketplaceCards.cards.length ? <p>No cards to show</p> : null}
        </ul>
      </section>
    </>
  );
};

export default Marketplace;
