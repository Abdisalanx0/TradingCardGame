import React, { createContext, useState } from "react";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [cart, setCart] = useState({ cards: [], count: 0, totalPrice: 0 });

  // adds card
  const addCardToCart = (card) => {
    setCart((oldCart) => {
      const newCart = {
        cards: [...oldCart.cards, card],
        count: oldCart.count + 1,
        totalPrice: oldCart.totalPrice + card.price
      };

      return newCart;
    })
  }

  // removes card where card.id === cardId
  const removeCardFromCart = (cardId) => {
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
  }

  return (
    <CheckoutContext.Provider value={{ cart, setCart, addCardToCart, removeCardFromCart }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutContext;
