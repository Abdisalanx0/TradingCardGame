import React, { useContext } from 'react'
import HeaderComponent from '../component/header/HeaderComponent'
import HeaderContext from '../context/HeaderContext'
import MarketplaceComponent from '../component/main/MarketplaceComponent'
import InventoryComponent from '../component/main/InventoryComponent'
import FooterComponent from '../component/footer/FooterComponent'
import MessageComponent from '../component/aside/MessageComponent'
import '../css/page/Dashboard.css'

const Dashboard = () => {
  const { currentTab } = useContext(HeaderContext)

  const currentComponent = () => {
    switch(currentTab) {
      case 'marketplace':
        return <MarketplaceComponent></MarketplaceComponent>

      case 'inventory':
        return <InventoryComponent></InventoryComponent>
    }
  }

  return (
    <>
      <HeaderComponent></HeaderComponent>

      <main id='dashboard-main'>
        { currentComponent() }

        <MessageComponent></MessageComponent>
      </main>


      <FooterComponent></FooterComponent>
    </>
  )
}

export default Dashboard