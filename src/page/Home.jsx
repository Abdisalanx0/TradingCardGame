import React from "react";
import HomeNavigation from "../component/header/HomeNavigation";
import HomeHero from "../component/main/HomeHero";
import About from "../component/main/About";
import Contact from "../component/main/Contact";
import Footer from "../component/footer/Footer";
const Home = () => {
  return (
    <>
      <HomeNavigation />
      <HomeHero />
      <About />
      <Footer/>
    </>
  );
};

export default Home;
