import React from 'react'
import HeaderComponent from '../components/header/HeaderComponent'
import LoginComponent from '../components/main/LoginComponent'
import FooterComponent from '../components/footer/FooterComponent'

const Login = () => {
  return (
    <>
      <HeaderComponent></HeaderComponent>
      <LoginComponent></LoginComponent>
      <FooterComponent></FooterComponent>
    </>
  )
}

export default Login