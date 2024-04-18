import React, { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import FetchUrl from "./FetchUrl"; // Assuming FetchUrl exports a base URL string

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState({});
  const [isMessageBoxExpanded, setIsMessageBoxExpanded] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState("");
  const { isLoggedIn } = useContext(AuthContext);

  const fetchMessages = async () => {
    if (!isLoggedIn) {
      console.log("User is not logged in.");
      return;
    }

    const username = sessionStorage.getItem("username");
    if (!username) {
      console.log("No username found in session storage.");
      return;
    }

    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const data = { username };

      const response = await fetch(
        `${FetchUrl}/getMessages.php`, 
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        setMessages(responseData); // Assume responseData is correctly formatted
      } else {
        console.log("Failed to fetch messages. HTTP status:", response.status);
      }
    } catch (err) {
      console.error("Error fetching messages:", err.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [isLoggedIn]); 

  return (
    <MessageContext.Provider
      value={{
        messages,
        setMessages,
        isMessageBoxExpanded,
        setIsMessageBoxExpanded,
        selectedConversation,
        setSelectedConversation,
        fetchMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;
