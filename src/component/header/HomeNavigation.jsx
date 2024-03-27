import React from "react";
import "../../css/header/HomeHeaderComponent.css";

const HomeNavigation = () => {
  return (
    <div>
      <nav class="nav-bar">
        <div class="icon-nav">
          <i class="fas fa-moon"></i>
          <span class="logo">TCG</span>
        </div>

        <ul class="list-nav-bar active">
          <li class="list-item">
            <a href="#">home</a>
          </li>
          <li class="list-item">
            <a href="#about">about</a>
          </li>
          <li class="list-item">
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
