import React from "react";
import "../../css/page/Home.css";
const HomeHero = () => {
  return (
    <div className="content-container">
      <h1 className="main-title">Collect All your favorite cards</h1>
      <p className="secondary-text">Create Your Favorite Line up</p>
      <a href={ sessionStorage.getItem('username') ? "/dashboard" : "/login" }>
        <button className="cta-button">Start Collecting</button>
      </a>
    </div>
  );
};

export default HomeHero;
