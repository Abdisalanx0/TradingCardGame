import React from "react";
import "../../css/header/HomeHeaderComponent.css";

const HomeNavigation = () => {
  return (
    <div>
      <nav className="nav-bar">
        <div className="icon-nav">
          <i className="fas fa-moon"></i>
          <span className="logo">TCG</span>
        </div>

        <ul className="list-nav-bar active">
          <li className="list-item">
            <a href="#">home</a>
          </li>
          <li className="list-item">
            <a href="#about">about</a>
          </li>
          <li className="list-item">
            <a href="#contact">contact</a>
          </li>
          <a href="/login">
        <button>LOGIN</button>
      </a>
        </ul>
      </nav>
    </div>
  );
};

export default HomeNavigation;
