import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userSettings, setUserSettings] = useState({ isDarkMode: false });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (userSettings.isDarkMode) {
      document.getElementById("root").classList.add("dark-mode");
      document.getElementById("root").classList.remove("light-mode");
    } else {
      document.getElementById("root").classList.add("light-mode");
      document.getElementById("root").classList.remove("dark-mode");
    }
  }, [userSettings]);

  return (
    <AuthContext.Provider
      value={{
        username,
        setUsername,
        password,
        setPassword,
        userSettings,
        setUserSettings,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
