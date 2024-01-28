import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'
import HeaderContext from '../../contexts/HeaderContext'
import '../../css/main/LoginComponent.css'

const LoginComponent = () => {
  const { username, setUsername, password, setPassword } = useContext(AuthContext)
  const { setCurrentTab } = useContext(HeaderContext)

  const navigate = useNavigate()

  const handleUsernameOnChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordOnChange = (e) => {
    setPassword(e.target.value)
  }

  const handleRegisterOnClick = (e) => {
    e.preventDefault()

    setPassword('')
  }

  const handleLoginOnClick = (e) => {
    e.preventDefault()

    setPassword('')
    setCurrentTab('marketplace')

    navigate('/dashboard')
  }

  return (
    // login main
    <main id='login-main'>
      {/* authentication form */}
      <form id='login-form'>
        {/* username/password fieldset */}
        <fieldset id='login-inputs-fieldset'>
          <legend>Authenticate</legend>

          {/* username input */}
          <input id='username-input' placeholder='username' value={ username } onChange={ handleUsernameOnChange }></input>
          <label hidden htmlFor='username-input' value='username'></label>

          {/* password input */}
          <input id='password-input' type='password' placeholder='password' value={ password } onChange={ handlePasswordOnChange }></input>
          <label hidden htmlFor='password-input' value='password'></label>
        </fieldset>

        {/* submission fieldset */}
        <fieldset id='login-submission-fieldset'>
          <legend>Submit</legend>

          {/* button inputs do not require labels */}

          {/* register button */}
          <input id='register-button' type='submit' value='Register' onClick={ handleRegisterOnClick }></input>

          {/* login button */}
          <input id='login-button' type='submit' value='Login' onClick={ handleLoginOnClick }></input>
        </fieldset>
      </form>
    </main>
  )
}

export default LoginComponent