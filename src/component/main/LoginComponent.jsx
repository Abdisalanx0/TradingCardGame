import React, { useContext } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import HeaderContext from '../../context/HeaderContext'
import '../../css/main/LoginComponent.css'

const LoginComponent = () => {
  const { username, setUsername, password, setPassword} = useContext(AuthContext)
  const { setCurrentTab } = useContext(HeaderContext)
  const [serverMessage, setServerMessage] = useState("")
  const navigate = useNavigate()

  const handleUsernameOnChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordOnChange = (e) => {
    setPassword(e.target.value)
  }

  const handleRegisterOnClick = (e) => {
    e.preventDefault()  // Prevents the default form submission behavior.

    // Checks if both username and password are not empty.
    if (username !== "" && password !== "") {
        const url = "http://localhost/php/registration.php" // URL to send the registration request.
        
        // Headers for the fetch request.
        const headers = {
            "Accept": "application/json", // Tells the server to send data in JSON format.
            "Content-Type": "application/json" // Indicates that the request body will be JSON.
        }

        // Data to be sent in the request, containing the username and password.
        const data = { username, password }

        // Making a POST request to the registration URL.
        fetch(url, {
            method: "POST",   // Using POST method for the request.
            headers: headers, // Including headers in the request.
            body: JSON.stringify(data) // Sending the registration data as a JSON string.
        })
        .then((response) => response.json()) // Parses the JSON response from the server.
        .then((response) => {
            // If registration is successful and a message is received.
            if (response.success && response.message) {
                setServerMessage(response.message) // Sets the message to be displayed.
                
                navigate('/') // Navigate to the login page after registration.
            } else {
                // If registration fails, set an error message.
                setServerMessage(response.message || "An unknown error occurred.")
            }
        })
        .catch((err) => {
            // In case of a network or other fetch-related error.
            setServerMessage("An error occurred. Please try again.")
            console.error(err) // Logs the error to the console.
        })
    } else {
        // If either username or password is empty.
        setServerMessage("Username and password cannot be empty.")
    }
}

  // This function handles the login process when the login button is clicked.
  const handleLoginOnClick = (e) => {
    e.preventDefault()  // Prevents the default form submission behavior.

    // Checks if both username and password are not empty.
    if (username !== "" && password !== "") {
        const url = "http://localhost/php/login.php" // URL to send the login request.
        
        // Headers for the fetch request.
        const headers = {
            "Accept": "application/json", // Tells the server to send data in JSON format.
            "Content-Type": "application/json" // Indicates that the request body will be JSON.
        }

        // Data to be sent in the request, containing the username and password.
        const data = { username, password }

        // Making a POST request to the login URL.
        fetch(url, {
            method: "POST",   // Using POST method for the request.
            headers: headers, // Including headers in the request.
            body: JSON.stringify(data) // Sending the login data as a JSON string.
        })
        .then((response) => response.json()) // Parses the JSON response from the server.
        .then((response) => {
            // If login is successful and a message is received.
            if (response.success && response.message) {
                setServerMessage(response.message) // Sets the message to be displayed.
                sessionStorage.setItem("username", username);
                // After a delay of 5 seconds, navigates to the dashboard.
                setTimeout(function () {
                  setCurrentTab("marketplace") // Set the current tab to 'marketPlace'.
                  navigate('/dashboard') // Navigate to the dashboard.
                }, 5000)
            } else {
                // If login fails, set an error message.
                setServerMessage(response.message || "An unknown error occurred.")
            }
        })
        .catch((err) => {
            // In case of a network or other fetch-related error.
            setServerMessage("An error occurred. Please try again.")
            console.error(err) // Logs the error to the console.
        })
    } else {
        // If either username or password is empty.
        setServerMessage("Username and password cannot be empty.")
    }
  }

  return (
    // login main
    <main id='login-main'>
      {/* authentication form */}
      <form id='login-form'>
        {/* username/password fieldset */}
        <fieldset id='login-inputs-fieldset'>
          <legend>Authenticate</legend>

          <p id='server-message'>{ serverMessage }</p>

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
          <input id='register-button' type='button' value='Register' onClick={ handleRegisterOnClick }></input>

          {/* login button */}
          <input id='login-button' type='submit' value='Login' onClick={ handleLoginOnClick }></input>

        </fieldset>
      </form>
    </main>
  )
}

export default LoginComponent
