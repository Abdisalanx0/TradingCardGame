import React from "react";
import "../../css/page/Home.css";
const HomeHero = () => {
  return (
    <div class="content-container">
      <h1 class="main-title">Collect All your favorite cards</h1>
      <p class="secondary-text">Create Your Favorite Line up</p>
      <a href="/login">
        <button class="cta-button">Start Collecting</button>
      </a>
    </div>
  );
};

export default HomeHero;
