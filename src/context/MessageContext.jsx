import React, { createContext, useEffect, useState } from 'react'

const MessageContext = createContext()

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
  const [expandedConversation, setExpandedConversation] = useState('')

  useEffect(() => {
    const handleFetchMessages = async () => {
      try {
        const response = await fetch('./src/context/messages.json')
  
        if(response.ok) {
          const data = await response.json()
  
          setMessages(data)
        }
      }
      catch(err) {
        console.log(err.message)
      }
    }

    handleFetchMessages()
  }, [])

  return (
    <MessageContext.Provider value={ { messages, setMessages, isMessageBoxExpanded, setIsMessageBoxExpanded, expandedConversation, setExpandedConversation } }>{ children }</MessageContext.Provider>
  )
}

export default MessageContext