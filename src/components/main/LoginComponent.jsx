import React, { useContext } from 'react'
import AuthContext from '../../contexts/AuthContext'
import '../../css/main/LoginComponent.css'

const LoginComponent = () => {
  const { username, setUsername, password, setPassword } = useContext(AuthContext)

  const handleUsernameOnChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordOnChange = (e) => {
    setPassword(e.target.value)
  }

  const handleRegisterOnSubmit = (e) => {
    e.preventDefault()

    setPassword('')
  }

  const handleLoginOnSubmit = (e) => {
    e.preventDefault()

    setPassword('')
  }

  return (
    // login main
    <main id='login-main'>
      {/* authentication form */}
      <form id='login-form'>
        {/* username/password fieldset */}
        <fieldset id='login-inputs-fieldset'>
          {/* username input */}
          <input id='username-input' placeholder='username' value={ username } onChange={ handleUsernameOnChange }></input>
          <label hidden htmlFor='username-input' value='username'></label>

          {/* password input */}
          <input id='password-input' placeholder='password' value={ password } onChange={ handlePasswordOnChange }></input>
          <label hidden htmlFor='password-input' value='password'></label>
        </fieldset>

        {/* submission fieldset */}
        <fieldset id='login-submission-fieldset'>
          {/* button inputs do not require labels */}

          {/* register button */}
          <input id='register-button' type='submit' value='Register' onClick={ handleRegisterOnSubmit }></input>

          {/* login button */}
          <input id='login-button' type='submit' value='Login' onClick={ handleLoginOnSubmit }></input>
        </fieldset>
      </form>
    </main>
  )
}

export default LoginComponent