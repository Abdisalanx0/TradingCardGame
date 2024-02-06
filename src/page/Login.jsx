import React from 'react'
import LoginHeaderComponent from '../component/header/LoginHeaderComponent'
import LoginComponent from '../component/main/LoginComponent'
import FooterComponent from '../component/footer/FooterComponent'

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