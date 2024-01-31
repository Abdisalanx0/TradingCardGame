import React, { useContext } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../contexts/AuthContext'
import HeaderContext from '../../contexts/HeaderContext'
import '../../css/main/LoginComponent.css'

const LoginComponent = () => {
  const { username, setUsername, password, setPassword} = useContext(AuthContext)
  const { setCurrentTab } = useContext(HeaderContext)
  const [errorMsg, setErrorMsg] = useState("");
  const [msg, setMsg] = useState("");


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

  // This function handles the login process when the login button is clicked.
const handleLoginOnClick = (e) => {
  e.preventDefault();  // Prevents the default form submission behavior.

  // Checks if both username and password are not empty.
  if (username !== "" && password !== "") {
      const url = "http://localhost/php/login.php"; // URL to send the login request.
      
      // Headers for the fetch request.
      const headers = {
          "Accept": "application/json", // Tells the server to send data in JSON format.
          "Content-Type": "application/json" // Indicates that the request body will be JSON.
      };

      // Data to be sent in the request, containing the username and password.
      const data = { username, password };

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
              setMsg(response.message); // Sets the message to be displayed.

              // After a delay of 5 seconds, navigates to the dashboard.
              setTimeout(function () {
                setCurrentTab("MarketPlace") // Set the current tab to 'MarketPlace'.
                navigate('/dashboard'); // Navigate to the dashboard.
              }, 5000);
          } else {
              // If login fails, set an error message.
              setErrorMsg(response.message || "An unknown error occurred.");
          }
      })
      .catch((err) => {
          // In case of a network or other fetch-related error.
          setErrorMsg("An error occurred. Please try again.");
          console.error(err); // Logs the error to the console.
      });
  } else {
      // If either username or password is empty.
      setErrorMsg("Username and password cannot be empty.");
  }
};



  return (
    // login main
    <main id='login-main'>
         <h1>{msg}</h1>
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

          <h1>{errorMsg}</h1>
        </fieldset>
      </form>
    </main>
  )
}

export default LoginComponent