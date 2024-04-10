import React, { useContext } from "react";
import CheckoutContext from "../../context/CheckoutContext";

const Checkout = () => {
  const { cart, setCart } = useContext(CheckoutContext);

  const handleCheckoutOnClick = async () => {
    const username = sessionStorage.getItem("username");

    const cardIds = cart.cards.map((card) => card.id);
    const tPrice = cart.totalPrice;

    const data = {
      username, // Or userId, depending on how you're identifying the user on the backend
      cardIds,
      tPrice,
    };

    try {
      const response = await fetch("http://localhost/php/cardPurchase.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const jsonResponse = await response.json();

        // Clear the cart if successful
        setCart({ cards: [], count: 0, totalPrice: 0 }); // Reset the cart in context
        sessionStorage.removeItem("cart"); // If you're also syncing the cart to sessionStorage, clear it here
        alert(jsonResponse.message);
      } else {
        throw new Error("Failed to send data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing your purchase.");
    }
  };


  const handleRemoveFromCartOnClick = (e) => {
    const delimiterIndex = e.target.id.indexOf("-remove-from-cart-button");
    const cardId = Number(e.target.id.substring(0, delimiterIndex));

    setCart((oldCart) => {
      const newCart = {
        cards: [],
        count: oldCart.count,
        totalPrice: oldCart.totalPrice,
      };

      for (let i = 0; i < oldCart.cards.length; i++) {
        if (oldCart.cards[i].id === cardId) {
          newCart.count--;
          newCart.totalPrice -= oldCart.cards[i].price;
        } else {
          newCart.cards.push(oldCart.cards[i]);
        }
      }

      return newCart;
    });
  };

  
  const generateCartCard = (card) => {
    return (
      <li
        key={card.id}
        id={`${card.id}-card`}
        className={`${card.rarity}-card card`}
      >
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
            <input
              id={`${card.id}-remove-from-cart-button`}
              className="card-remove-from-cart-button"
              type="button"
              value="Remove from Cart"
              onClick={handleRemoveFromCartOnClick}
            ></input>
          </label>
        </form>
      </li>
    );
  };
  return (
    <>
      <form id="checkout-form">
        {cart.count ? (
          <fieldset id="checkout-fieldset">
            <legend hidden>Checkout Confirmation</legend>

            <p>Cart Total: {cart.totalPrice} CZ</p>


            <input id="checkout-button" type="button" value="Checkout" onClick={ handleCheckoutOnClick }></input>
          </fieldset>
        ) : null}
      </form>

      <section id="cards-section">
        <h2>Checkout</h2>

        <ul id="cards-ul">
          {cart.cards.map(generateCartCard)}

          {!cart.count ? <p>No cards to show</p> : null}
        </ul>
      </section>
    </>
  );
};

export default Checkout;
