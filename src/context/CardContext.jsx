import React, { createContext } from "react";

const CardContext = createContext();

export const CardProvider = ({ children }) => {
  // needed only for inventory cards
  // marketplace and trade-request cards sorted on backend
  const sortCards = (cards, sort) => {
    const delimiter = sort.indexOf(" ");

    const property = sort.substring(0, delimiter);
    const orientation = sort.substring(delimiter + 1);

    const orientationMultiplier = orientation === "asc" ? 1 : -1;

    const newCards = cards.toSorted((a, b) => {
      let aValue = a[property];
      let bValue = b[property];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return -1 * orientationMultiplier;
      } else if (aValue > bValue) {
        return 1 * orientationMultiplier;
      } else {
        return 0;
      }
    });

    return newCards;
  };

  return (
    <CardContext.Provider value={{ sortCards }}>
      {children}
    </CardContext.Provider>
  );
};

export default CardContext;
