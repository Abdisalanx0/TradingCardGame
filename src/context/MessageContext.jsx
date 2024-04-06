import React, { createContext, useEffect, useState } from 'react'

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  /*
    {
      'otherUsername': [
        { 
          id,
          content,
          originator // 'other' || 'self'
        }, 
        ...
      ],
      ...
    }
  */
  const [messages, setMessages] = useState({})
  const [isMessageBoxExpanded, setIsMessageBoxExpanded] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState('')
  const [messageToSend, setMessageToSend] = useState('')

  useEffect(() => {
    const handleFetchMessages = async () => {
      try {
        const response = await fetch('./src/context/messages.json')
  
        if(response.ok) {
          const data = await response.json()
  
          setMessages(data)
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    handleFetchMessages();
  }, []);

  useEffect(() => {
    const userConversationList = document.getElementById('message-box-selected-user-conversation-ul')
  
    if(userConversationList) {
      const lastListItem = userConversationList.children[userConversationList.children.length - 1]

      userConversationList.scrollTo(0, lastListItem.offsetTop);
    }
  }, [messages])

  return (
    <MessageContext.Provider value={ { messages, setMessages, isMessageBoxExpanded, setIsMessageBoxExpanded, selectedConversation, setSelectedConversation, messageToSend, setMessageToSend } }>{ children }</MessageContext.Provider>
  )
}

export default MessageContext