import React from "react";

const About = () => {
  return (
    <div id="about" className="container">
      <div className="inner-container">
        <img className="image" src="/graphics/ash.png" alt="/" />
        <div className="text-section">
          <p className="text">ENTER THE WORLD OF TCG</p>
          <h1 className="heading">
            TCG: A Universe of Collecting and Trading Cards
          </h1>
          <p>
            Step into TCG, the premier platform for collecting and trading
            digital cards. Immerse yourself in a community where you can gather
            rare and exclusive cards, trade with friends and collectors
            worldwide, and connect through messaging. No battles, just the pure
            joy of completing your collection and the thrill of acquiring that
            elusive card to become a master collector.
          </p>
          <button className="button">Start Your Collection</button>
        </div>
      </div>
    </div>
  );
};

export default About;
