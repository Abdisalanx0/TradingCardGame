import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import HeaderContext from '../../context/HeaderContext'
import '../../css/header/HeaderComponent.css'

const HeaderComponent = () => {
  const { username } = useContext(AuthContext)
  const { currentTab, setCurrentTab } = useContext(HeaderContext)

  const navigate = useNavigate()

  const handleNavigationButtonOnClick = (e) => {
    if(e.target.value === 'Marketplace') {
      setCurrentTab('marketplace')
    }
    else if(e.target.value === 'Inventory') {
      setCurrentTab('inventory')
    }
  }

  const handleLogoutOnClick = async (e) => {
    navigate('/')

    location.reload()
  }

  return (
    <header id='page-header'>
      <h1 id='page-h1'>Trading Card Game</h1>

      <nav id='navigation-container'>
        <input className={ (currentTab === 'marketplace' ? 'current-tab-button ' : '') + 'navigation-button' } type='button' value='Marketplace' onClick={ handleNavigationButtonOnClick }></input>

        <input className={ (currentTab === 'inventory' ? 'current-tab-button ' : '') + 'navigation-button' } type='button' value='Inventory' onClick={ handleNavigationButtonOnClick }></input>
      </nav>

      <details id='user-dropdown'>
        <summary>Welcome, { username }</summary>

        <input id='logout-button' type='button' value='Logout' onClick={ handleLogoutOnClick }></input>
      </details>
    </header>
  )
}

export default HeaderComponent