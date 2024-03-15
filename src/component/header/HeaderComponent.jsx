import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import HeaderContext from '../../context/HeaderContext'
import '../../css/header/HeaderComponent.css'
import CheckoutContext from '../../context/CheckoutContext'

const HeaderComponent = () => {
  const { username, userSettings, setUserSettings } = useContext(AuthContext)
  const { currentTab, setCurrentTab } = useContext(HeaderContext)
  const { cart } = useContext(CheckoutContext)
  
  const navigate = useNavigate()

  const handleNavigationButtonOnClick = (e) => {
    if(e.target.value === 'Home') {
      setCurrentTab('Home')
    }
    else if(e.target.value === 'Marketplace') {
      setCurrentTab('marketplace')
    }
    else if(e.target.value === 'Inventory') {
      setCurrentTab('inventory')
    }
    // cart button onClick
    else if(e.target.value === 'Checkout') {
      setCurrentTab('checkout')
    }
  }

  const handleColorModeButtonOnClick = (e) => {
    setUserSettings((oldSettings) => {
      const newSettings = { ...oldSettings };
      const logo = document.getElementById('page-logo');
      
      if (newSettings.isDarkMode) {
        logo.src = 'public/icons/logo.png'; 
      } else {
        logo.src = 'public/icons/light-logo.png'; 
      }
      
      newSettings.isDarkMode = !newSettings.isDarkMode;
      
      return newSettings;
    });
  };
  

  const handleLogoutOnClick = async (e) => {
    navigate('/')
    location.reload()
    
  }

  return (
    <header id='page-header'>
      <img src="public\icons\logo.png" alt="Trading Card Game Logo" id="page-logo"></img>

      <nav id='navigation-container'>
        {/* home tab */}
        <input className={ (currentTab === 'home' ? 'current-tab-button ' : '') + 'navigation-button' } type='button' value='Home' onClick={ handleNavigationButtonOnClick }></input>

        {/* marketplace tab */}
        <input className={ (currentTab === 'marketplace' ? 'current-tab-button ' : '') + 'navigation-button' } type='button' value='Marketplace' onClick={ handleNavigationButtonOnClick }></input>

        {/* inventory tab */}
        <input className={ (currentTab === 'inventory' ? 'current-tab-button ' : '') + 'navigation-button' } type='button' value='Inventory' onClick={ handleNavigationButtonOnClick }></input>
      </nav>

      <section id='header-right-container'>
        <h2 hidden>Cart & User Dropdown</h2>

        <section id='cart-section' className='overlayed-button-container'>
          <h3 hidden>Cart</h3>

          {/* src: /icons/cart-icon.svg */}
          <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/></svg>

          <p id='cart-count-p'>{ cart.count > 0 ? cart.count : null }</p>

          <input type='button' className='overlayed-button' value='Checkout' onClick={ handleNavigationButtonOnClick }></input>
        </section>

        <details id='user-dropdown'>

          <summary id='user-dropdown-summary'>Welcome, {sessionStorage.getItem("username")}</summary>

          <input id='color-mode-button' type='button' value={ userSettings.isDarkMode ? 'Light Mode' : 'Dark Mode' } onClick={ handleColorModeButtonOnClick }></input>

          <input id='logout-button' type='button' value='Logout' onClick={ handleLogoutOnClick }></input>
        </details>
      </section>
    </header>
  )
}

export default HeaderComponent