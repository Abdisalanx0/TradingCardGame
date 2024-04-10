import React, { useContext } from 'react'
import Header from '../component/header/Header'
import HeaderContext from '../context/HeaderContext'
import Popup from '../component/main/Popup'
import Home from "/src/page/Home"
import Marketplace from '../component/main/Marketplace'
import Trade from '../component/main/Trade'
import Inventory from '../component/main/Inventory'
import Checkout from '../component/main/Checkout'
import Footer from '../component/footer/Footer'
import Message from '../component/main/Message'
import '../css/page/Dashboard.css'

const Dashboard = () => {
  const { currentTab } = useContext(HeaderContext);

  const currentTabComponent = () => {
    switch (currentTab) {
      case "Home":
        return <Home></Home>;

      case "Marketplace":
        return <Marketplace></Marketplace>;

      case "Trade":
        return <Trade></Trade>;

      case "Inventory":
        return <Inventory></Inventory>;

      case "Checkout":
        return <Checkout></Checkout>;

    }
  };

  return (
    <>
      <Header></Header>

      <main id='dashboard-main'>
        <Popup></Popup>

        <Message></Message>

        { currentTabComponent() }
      </main>

      <Footer></Footer>
    </>
  );
};

export default Dashboard;
