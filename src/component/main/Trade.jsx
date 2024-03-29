import React, { useContext } from 'react'
import TradeContext from '../../context/TradeContext'
import CheckoutContext from '../../context/CheckoutContext'

const Trade = () => {
  const { tradeCards, setTradeCards, tradeCardsSort, setTradeCardsSort, tradeCardsPriceFilter, setTradeCardsPriceFilter, tradeCardsNameFilter, setTradeCardsNameFilter, tradeCardsCurrentPage, setTradeCardsCurrentPage } = useContext(TradeContext)
  const { cart, setCart } = useContext(CheckoutContext)

  const handleAddToCartOnClick = (e) => {
    const delimiterIndex = e.target.id.indexOf("-add-to-cart-button");
    const itemId = Number(e.target.id.substring(0, delimiterIndex));

    if (e.target.value === "Add to Cart") {
      setCart((oldCart) => {
        const newCart = {
          items: [...oldCart.items],
          count: oldCart.count,
          totalPrice: oldCart.totalPrice,
        };

        for (let item of tradeCards.items) {
          if (item.id === itemId) {
            newCart.items.push(item);

            newCart.count++;
            newCart.totalPrice += item.price;

            break;
          }
        }

        return newCart;
      });
    } else if (e.target.value === "Remove from Cart") {
      setCart((oldCart) => {
        const newCart = {
          items: [],
          count: oldCart.count,
          totalPrice: oldCart.totalPrice,
        };

        for (let i = 0; i < oldCart.items.length; i++) {
          if (oldCart.items[i].id === itemId) {
            newCart.count--;
            newCart.totalPrice -= oldCart.items[i].price;
          } else {
            newCart.items.push(oldCart.items[i]);
          }
        }

        return newCart;
      });
    }
  };
  
  const generateTradeCard = (card) => {
    return (
      <li key={ card.id } id={ `${card.id}-trade-card` } className={ `${card.rarity}-card card` }>
        <figure className="card-figure">
          <p className="card-rarity-p">{card.rarity}</p>

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
                cart.items.some((cartItem) => cartItem.id === card.id)
                  ? "Remove from Cart"
                  : "Add to Cart"
              }
              onClick={handleAddToCartOnClick}
            ></input>
          </label>
        </form>
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

  const handlePageButtonOnClick = (e) => {
    if (e.target.value === "Previous" && tradeCardsCurrentPage > 1) {
      setTradeCardsCurrentPage(tradeCardsCurrentPage - 1);
    } else if (
      e.target.value === "Next" &&
      tradeCardsCurrentPage < tradeCards.totalPages
    ) {
      setTradeCardsCurrentPage(tradeCardsCurrentPage + 1);
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
            type="button"
            value="Name"
            onClick={handleSortButtonOnClick}
          ></input>

          <input
            type="button"
            value="Price"
            onClick={handleSortButtonOnClick}
          ></input>

          <input
            type="button"
            value="Rarity"
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
            {tradeCardsCurrentPage} of {tradeCards.totalPages}
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

      <section id='cards-section'>
        <h2>Trade Requests</h2>

        <ul id='cards-ul'>
          { tradeCards.items.map(generateTradeCard) }

          { !tradeCards.items.length ? <p>No items to show</p> : null }
        </ul>
      </section>
    </>
  )
}

export default Trade