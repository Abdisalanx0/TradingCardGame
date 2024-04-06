import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "../../css/main/LoginComponent.css";

const LoginComponent = () => {
  const { username, setUsername, password, setPassword, serverMessage, setServerMessage, register, login } = useContext(AuthContext);

  const handleUsernameOnChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordOnChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegisterOnClick = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior.

    register()
  };

  // This function handles the login process when the login button is clicked.
  const handleLoginOnClick = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior.

    login()
  };

  return (
    // login main
    <main id="login-main">
      {/* authentication form */}
      <form id="login-form">
        {/* username/password fieldset */}
        <fieldset id="login-inputs-fieldset">
          <legend>Authenticate</legend>

          <p id="server-message">{serverMessage}</p>

          {/* username input */}
          <input
            id="username-input"
            placeholder="username"
            value={username}
            onChange={handleUsernameOnChange}
          ></input>
          <label hidden htmlFor="username-input" value="username"></label>

          {/* password input */}
          <input
            id="password-input"
            type="password"
            placeholder="password"
            value={password}
            onChange={handlePasswordOnChange}
          ></input>
          <label hidden htmlFor="password-input" value="password"></label>
        </fieldset>

        {/* submission fieldset */}
        <fieldset id="login-submission-fieldset">
          <legend>Submit</legend>

          {/* button inputs do not require labels */}

          {/* register button */}
          <input
            id="register-button"
            type="button"
            value="Register"
            onClick={handleRegisterOnClick}
          ></input>

          {/* login button */}
          <input
            id="login-button"
            type="submit"
            value="Login"
            onClick={handleLoginOnClick}
          ></input>
        </fieldset>
      </form>
    </main>
  );
};

export default LoginComponent;
