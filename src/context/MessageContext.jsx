import React, { createContext, useEffect, useState } from 'react';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState({});
  const [isMessageBoxExpanded, setIsMessageBoxExpanded] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState('');
  const [messageToSend, setMessageToSend] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleFetchMessages = async () => {
      try {
        const response = await fetch('./src/context/messages.json');

        if (response.ok) {
          const data = await response.json();

          setMessages(data);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    handleFetchMessages();
  }, []);

  useEffect(() => {
    const userConversationList = document.getElementById('message-box-selected-user-conversation-ul');

    if (userConversationList) {
      const lastListItem = userConversationList.children[userConversationList.children.length - 1];

      userConversationList.scrollTo(0, lastListItem.offsetTop);
    }
  }, [messages]);

  const sendConversation = async ({ sending_user_id, receiving_username, message_content }) => {
    if (message_content.trim() !== '' && receiving_username !== '') {
      setIsLoading(true);

      try {
        const response = await fetch('/Applications/AMPPS/TradingCardGame/php/user_Message.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sending_user_id,
            receiving_username,
            message_content,
          }),
        });

        if (response.ok) {
          
          const responseData = await response.json();
          console.log('Server response:', responseData);

          // Update messages context with new message
          setMessages((prevMessages) => {
            const updatedMessages = { ...prevMessages };
            const newMessage = {
              id: responseData.message_id, 
              content: message_content,
              originator: 'self',
            };
            updatedMessages[receiving_username] = [...prevMessages[receiving_username], newMessage];
            return updatedMessages;
          });
          setMessageToSend('');
        } else {
          console.error('Failed to send message:', response.status);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }

      setIsLoading(false);
    }
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        setMessages,
        isMessageBoxExpanded,
        setIsMessageBoxExpanded,
        selectedConversation,
        setSelectedConversation,
        messageToSend,
        setMessageToSend,
        sendConversation,
        isLoading,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;