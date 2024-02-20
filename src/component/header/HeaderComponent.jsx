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
    if(e.target.value === 'Marketplace') {
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
      const newSettings = { ...oldSettings }

      newSettings.isDarkMode = !newSettings.isDarkMode

      return newSettings
    })
  }

  const handleLogoutOnClick = async (e) => {
    navigate('/')

    location.reload()
  }

  return (
    <header id='page-header'>
      <h1 id='page-h1'>Trading Card Game</h1>

      <nav id='navigation-container'>
        {/* marketplace tab */}
        <input className={ (currentTab === 'marketplace' ? 'current-tab-button ' : '') + 'navigation-button' } type='button' value='Marketplace' onClick={ handleNavigationButtonOnClick }></input>

        {/* inventory tab */}
        <input className={ (currentTab === 'inventory' ? 'current-tab-button ' : '') + 'navigation-button' } type='button' value='Inventory' onClick={ handleNavigationButtonOnClick }></input>
      </nav>

      <section id='header-right-container'>
        <h2 hidden>Cart & User Dropdown</h2>

        <section id='cart-section' className='overlayed-button-container'>
          <h3 hidden>Cart</h3>

          <img src='/icons/cart-icon.svg'></img>

          <p id='cart-count-p'>{ cart.count > 0 ? cart.count : null }</p>

          <input type='button' className='overlayed-button' value='Checkout' onClick={ handleNavigationButtonOnClick }></input>
        </section>

        <details id='user-dropdown'>
          <summary id='user-dropdown-summary'>Welcome, { username }</summary>

          <input id='color-mode-button' type='button' value={ userSettings.isDarkMode ? 'Light Mode' : 'Dark Mode' } onClick={ handleColorModeButtonOnClick }></input>

          <input id='logout-button' type='button' value='Logout' onClick={ handleLogoutOnClick }></input>
        </details>
      </section>
    </header>
  )
}

export default HeaderComponent