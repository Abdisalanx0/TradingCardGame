import React, { useContext, useState, useEffect } from "react";
import MessageContext from "../../context/MessageContext";
import AuthContext from "../../context/AuthContext";
import FetchUrl from "../../context/FetchUrl"; 
import EventsContext from "../../context/EventsContext";


const Message = () => {
  const {
    messages,
    setMessages,
    isMessageBoxExpanded,
    setIsMessageBoxExpanded,
    selectedConversation,
    setSelectedConversation,
    messageToSend,
    setMessageToSend,
  } = useContext(MessageContext);

  const { username } = useContext(AuthContext); 
    const {
      setPopupContent,
      setPopupConfirmationCallback,
      openPopup,
      resetPopup,
    } = useContext(EventsContext);

 useEffect(() => {
   console.log("Messages updated:", messages); // This will log messages every time they update
 }, [messages]);



  const handleToggleExpandOnClick = (e) => {
    setIsMessageBoxExpanded(!isMessageBoxExpanded);
  };

  const handleConversationButtonOnClick = (e) => {
    setSelectedConversation(e.target.value);
    console.log(selectedConversation);
  };

  const handleEnterMessageOnChange = (e) => {
    setMessageToSend(e.target.value);
  };

  const handleEnterMessageOnKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (messageToSend.trim()) {
        try {
          const response = await fetch(`${FetchUrl}/setMessages.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sendingUsername: username, // current user from AuthContext
              receiverUsername: selectedConversation, // otherUser is the selectedConversation
              message: messageToSend,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            console.log(data);
            setMessageToSend(""); 
          }
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    }
  };

  const generateConversationUser = (otherUsername) => {
    return (
      <li
        key={`${otherUsername}-conversation-item`}
        className="message-box-conversation-list-item"
      >
        <input
          className={
            (otherUsername === selectedConversation
              ? "selected-conversation-button "
              : "") + "message-box-conversation-button"
          }
          type="button"
          value={otherUsername}
          onClick={handleConversationButtonOnClick}
        ></input>
      </li>
    );
  };

  const generateSelectedConversation = (message) => {
  
    return (
      <li
        key={message.id}
        id={`${message.id}-message-item`}
        className={
          (message.originator === "self"
            ? "sent-message-item"
            : "received-message-item") + " message-item"
        }
      >
        {message.content}
      </li>
    );
  };

  const handleAddUserButtonOnClick = (e) => {
    e.preventDefault();
    setPopupContent(() => {
      const newContent = {};
      newContent.html = (
        <>
          <h3>New message</h3>
          <form id="Message-popup-form">
            <input
              id="receiving-username" // Corrected ID
              type="text"
              placeholder="Enter username"
            ></input>
            <textarea id="message-text-area" placeholder="Message"></textarea>
            
          </form>
        </>
      );
      return newContent;
    });
    setPopupConfirmationCallback(() => handleNewMessageOnClick);
    openPopup();
    
  };

  const handleNewMessageOnClick = async () => {
   

    // Retrieve form data
    const usernameInput = document.getElementById("receiving-username");
    const messageTextarea = document.getElementById("message-text-area");
    if (usernameInput && messageTextarea) {
      const receivingUsername = usernameInput.value; // Corrected variable name
      const newMessage = messageTextarea.value;
      const sendingUsername = "YourSendingUsername"; // This needs to be set based on your app context

      try {
        // Send POST request to the server
        const response = await fetch(`${FetchUrl}/setMessages.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sendingUsername: username,
            receiverUsername: receivingUsername,
            message: newMessage,
          }),
        });

        if (response.ok) {
          resetPopup();
          console.log("Message sent successfully");
          
        } else {
          throw new Error("Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };









  return (
    <aside id="message-box">
      <header id="message-box-header">
        <h3 id="message-box-h3">Messages</h3>
        {/* Icons and buttons to toggle message box expansion */}
        {isMessageBoxExpanded ? (
          <svg
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
          </svg>
        ) : (
          <svg
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path d="m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z" />
          </svg>
        )}
        <input
          id="message-box-toggle-expand-button"
          type="button"
          value={isMessageBoxExpanded ? "Collapse" : "Expand"}
          onClick={handleToggleExpandOnClick}
        ></input>
      </header>
      {/* Conversation section */}
      {isMessageBoxExpanded ? (
        <section id="message-box-conversations-section">
          <section id="message-box-conversation-users-section">
            <form id="message-box-user-search-form" autoComplete="off">
              <fieldset id="message-box-user-search-fieldset">
                <input
                  id="message-box-add-user-button"
                  type="button"
                  value="Add Conversation"
                  onClick={handleAddUserButtonOnClick}
                ></input>
              </fieldset>
            </form>
            <section id="active-conversations-section">
              <h5 id="active-conversations-heading">Active Conversations</h5>
              <ul id="message-box-conversation-users-ul">
                {Object.keys(messages).map(generateConversationUser)}
              </ul>
            </section>
          </section>
          {/* Display messages for selected conversation */}
          {messages[selectedConversation] ? (
            <section id="message-box-selected-user-conversation-section">
              <ul id="message-box-selected-user-conversation-ul">
                {messages[selectedConversation].map(
                  generateSelectedConversation
                )}
              </ul>
              <form autoComplete="off">
                <textarea
                  id={`${selectedConversation}-textarea`}
                  className="message-box-textarea"
                  placeholder="enter message"
                  value={messageToSend}
                  onChange={handleEnterMessageOnChange}
                  onKeyDown={handleEnterMessageOnKeyDown}
                ></textarea>
              </form>
            </section>
          ) : (
            <p id="no-selected-conversation-p">Select a Conversation</p>
          )}
        </section>
      ) : null}
    </aside>
  );
};

export default Message;
