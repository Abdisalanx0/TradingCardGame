import React from 'react'
import LoginHeaderComponent from '../components/header/LoginHeaderComponent'
import LoginComponent from '../components/main/LoginComponent'
import FooterComponent from '../components/footer/FooterComponent'

const Login = () => {
  return (
    <>
      <LoginHeaderComponent></LoginHeaderComponent>
      <LoginComponent></LoginComponent>
      <FooterComponent></FooterComponent>
    </>
  )
}

export default Login