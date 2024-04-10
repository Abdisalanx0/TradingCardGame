import React, { useContext } from 'react'
import HeaderComponent from '../component/header/HeaderComponent'
import HeaderContext from '../context/HeaderContext'
import PopupComponent from '../component/main/PopupComponent'
import Home from "/src/page/Home"
import MarketplaceComponent from '../component/main/MarketplaceComponent'
import Trade from '../component/main/Trade'
import InventoryComponent from '../component/main/InventoryComponent'
import CheckoutComponent from '../component/main/CheckoutComponent'
import FooterComponent from '../component/footer/FooterComponent'
import MessageComponent from '../component/aside/MessageComponent'
import '../css/page/Dashboard.css'

const Dashboard = () => {
  const { currentTab } = useContext(HeaderContext);

  const currentComponent = () => {
    switch (currentTab) {
      case "Home":
        return <Home></Home>;

      case "Marketplace":
        return <MarketplaceComponent></MarketplaceComponent>;

      case "Trade":
        return <Trade></Trade>;

      case "Inventory":
        return <InventoryComponent></InventoryComponent>;

      case "Checkout":
        return <CheckoutComponent></CheckoutComponent>;

      case "Message":
        return <MessageComponent></MessageComponent>;
    }
  };

  return (
    <>
      <HeaderComponent></HeaderComponent>

      <main id='dashboard-main'>
        <PopupComponent></PopupComponent>

        <MessageComponent></MessageComponent>

        { currentComponent() }
      </main>

      <FooterComponent></FooterComponent>
    </>
  );
};

export default Dashboard;
