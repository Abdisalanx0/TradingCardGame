import React from "react";

const HomeNavigation = () => {
  return (
    <div>
      <nav className="nav-bar">
        <div className="icon-nav">
          <h1 className="logo">TCG</h1>
        </div>

        <ul className="list-nav-bar active">
          <li className="list-item">
            <a href="#">home</a>
          </li>
          <li className="list-item">
            <a href="#about">about</a>
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
