import React, { useContext } from "react";
import CheckoutContext from "../../context/CheckoutContext";
import "../../css/main/CheckoutComponent.css";

const CheckoutComponent = () => {
  const { cart, setCart } = useContext(CheckoutContext);

  const handleCheckoutOnClick = async () => {
    const username = sessionStorage.getItem("username");

    // Assuming `cart` from `CheckoutContext` already contains the items array you need
    const cardIds = cart.items.map((item) => item.id);
    console.log(cardIds);
    const data = {
      username, // Or userId, depending on how you're identifying the user on the backend
      cardIds,
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
        console.log(jsonResponse);
        // Clear the cart if successful
        setCart({ items: [], count: 0, totalPrice: 0 }); // Reset the cart in context
        sessionStorage.removeItem("cart"); // If you're also syncing the cart to sessionStorage, clear it here
        alert("Purchase successful!");
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
    const itemId = Number(e.target.id.substring(0, delimiterIndex));

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
  };

  
  const generateCartItem = (item) => {
    return (
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
          <label className="card-button-label">
            <input
              id={`${item.id}-remove-from-cart-button`}
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
          {cart.items.map(generateCartItem)}

          {!cart.count ? <p>No items to show</p> : null}
        </ul>
      </section>
    </>
  );
};

export default CheckoutComponent;
