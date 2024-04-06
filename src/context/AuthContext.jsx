import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userSettings, setUserSettings] = useState({ isDarkMode: false });
  const [coinBalance, setCoinBalance] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [serverMessage, setServerMessage] = useState('')

  const register = () => {
    // Checks if both username and password are not empty.
    if (username !== "" && password !== "") {
      const url = "http://localhost/php/registration.php"; // URL to send the registration request.

      // Headers for the fetch request.
      const headers = {
        Accept: "application/json", // Tells the server to send data in JSON format.
        "Content-Type": "application/json", // Indicates that the request body will be JSON.
      };

      // Data to be sent in the request, containing the username and password.
      const data = { username, password };

      // Making a POST request to the registration URL.
      fetch(url, {
        method: "POST", // Using POST method for the request.
        headers: headers, // Including headers in the request.
        body: JSON.stringify(data), // Sending the registration data as a JSON string.
      })
        .then((response) => response.json()) // Parses the JSON response from the server.
        .then((response) => {
          // If registration is successful and a message is received.
          if (response.success && response.message) {
            setServerMessage(response.message); // Sets the message to be displayed.
            setCoinBalance(response.coinBalance)

            navigate("/"); // Navigate to the login page after registration.
          } else {
            // If registration fails, set an error message.
            setServerMessage(response.message || "An unknown error occurred.");
          }
        })
        .catch((err) => {
          // In case of a network or other fetch-related error.
          setServerMessage("An error occurred. Please try again.");
          console.error(err); // Logs the error to the console.
        });
    } else {
      // If either username or password is empty.
      setServerMessage("Username and password cannot be empty.");
    }
  }

  const login = () => {
    // Checks if both username and password are not empty.
    if (username !== "" && password !== "") {
      const url = "http://localhost/php/login.php"; // URL to send the login request.

      // Headers for the fetch request.
      const headers = {
        Accept: "application/json", // Tells the server to send data in JSON format.
        "Content-Type": "application/json", // Indicates that the request body will be JSON.
      };

      // Data to be sent in the request, containing the username and password.
      const data = { username, password };

      // Making a POST request to the login URL.
      fetch(url, {
        method: "POST", // Using POST method for the request.
        headers: headers, // Including headers in the request.
        body: JSON.stringify(data), // Sending the login data as a JSON string.
      })
        .then((response) => response.json()) // Parses the JSON response from the server.
        .then((response) => {
          // If login is successful and a message is received.
          if (response.success && response.message) {
            setServerMessage(response.message); // Sets the message to be displayed.
            setIsLoggedIn(true);
            sessionStorage.setItem("username", username);
            setCoinBalance(response.coinBalance)
            // After a delay of 5 seconds, navigates to the dashboard.
            setTimeout(function () {
              navigate("/dashboard"); // Navigate to the dashboard.
            }, 5000);
          } else {
            // If login fails, set an error message.
            setServerMessage(response.message || "An unknown error occurred.");
          }
        })
        .catch((err) => {
          // In case of a network or other fetch-related error.
          setServerMessage("An error occurred. Please try again.");
          console.error(err); // Logs the error to the console.
        });
    } else {
      // If either username or password is empty.
      setServerMessage("Username and password cannot be empty.");
    }
  }

  const logout = () => {
    navigate('/')

    sessionStorage.removeItem('username')

    location.reload()
  }

  useEffect(() => {
    if (userSettings.isDarkMode) {
      document.getElementById("root").classList.add("dark-mode");
      document.getElementById("root").classList.remove("light-mode");
    } else {
      document.getElementById("root").classList.add("light-mode");
      document.getElementById("root").classList.remove("dark-mode");
    }
  }, [userSettings]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const sessionUsername = sessionStorage.getItem("username")

      if(sessionUsername) {
        const response = await fetch('http://localhost/php/userInfo.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: sessionUsername })
        })

        if(response.ok) {
          const data = await response.json()

          setUsername(sessionUsername)
          setCoinBalance(data.coinBalance)
          setIsLoggedIn(true)
        }
      }
    }

    fetchUserInfo()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        username,
        setUsername,
        password,
        setPassword,
        userSettings,
        setUserSettings,
        coinBalance, 
        setCoinBalance,
        isLoggedIn,
        setIsLoggedIn,
        serverMessage, 
        setServerMessage,
        register, 
        login, 
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
