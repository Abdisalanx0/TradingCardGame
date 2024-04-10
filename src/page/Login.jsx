import React from "react";
import LoginHeader from "../component/header/LoginHeader";
import LoginMain from "../component/main/Login"; // imports 'Login' as 'LoginMain'
import Footer from "../component/footer/Footer";

const Login = () => {
  return (
    <>
      <LoginHeader></LoginHeader>
      <LoginMain></LoginMain>
      <Footer></Footer>
    </>
  );
};

export default Login;
