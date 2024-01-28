import React, { useContext } from 'react'
import HeaderComponent from '../components/header/HeaderComponent'
import HeaderContext from '../contexts/HeaderContext'
import MarketplaceComponent from '../components/main/MarketplaceComponent'
import FooterComponent from '../components/footer/FooterComponent'

const Dashboard = () => {
  const { currentTab } = useContext(HeaderContext)

  const currentComponent = () => {
    switch(currentTab) {
      case 'marketplace':
        return <MarketplaceComponent></MarketplaceComponent>
    }
  }

  return (
    <>
      <HeaderComponent></HeaderComponent>

      { currentComponent() }

      <FooterComponent></FooterComponent>
    </>
  )
}

export default Dashboard