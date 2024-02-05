import React, { useContext } from 'react'
import MessageContext from '../../context/MessageContext'
import '../../css/aside/MessageComponent.css'

const MessageComponent = () => {
  const { messages, setMessages, isMessageBoxExpanded, setIsMessageBoxExpanded, expandedConversation, setExpandedConversation } = useContext(MessageContext)

  const handleToggleExpandOnClick = (e) => {
    setIsMessageBoxExpanded(!isMessageBoxExpanded)
  }

  const generateMessageItem = (item) => {
    return (
      <li key={ item.id } id={ `${item.id}-message-item` } className={ (item.originator === 'self' ? 'sent-message-item' : 'received-message-item') + ' message-item' }>
        <p>{ item.content }</p>
      </li>
    )
  }

  const handleConversationButtonOnClick = (e) => {
    setExpandedConversation(e.target.value)
  }

  const handleEnterMessageOnKeyDown = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault()

      if(e.target.value) {
        setMessages((oldMessages) => {
          const newMessages = { ...oldMessages }
  
          const delimiterIndex = e.target.id.indexOf('-message-input')
          const usernameKey = e.target.id.substring(0, delimiterIndex)
  
          newMessages[usernameKey] = [...newMessages[usernameKey], { id: newMessages[usernameKey].length + 1, content: e.target.value, originator: 'self' }]
  
          return newMessages
        })
      }
    }
  }

  const generateMessagesBetweenUser = (otherUsername) => {
    const messagesBetweenUser = messages[otherUsername]

    return (
      <li key={ `${otherUsername}-conversation-item` } id='message-box-conversation-list-item'>
        <input className='message-box-conversation-button' type='button' value={ otherUsername } onClick={ handleConversationButtonOnClick }></input>

        {
          expandedConversation === otherUsername ?
            <>
              <ul className='message-box-conversation-ul'>
                { messagesBetweenUser.map(generateMessageItem) }
              </ul>

              <form autoComplete='off'>
                <input id={ `${otherUsername}-message-input` } className='message-box-message-input' placeholder='enter message' onKeyDown={ handleEnterMessageOnKeyDown }></input>
              </form>
            </>
          :
            null
        }

      </li>
    )
  }

  return (
    <aside id='message-box'>
      <header id='message-box-header'>
        <h3 id='message-box-h3'>Messages</h3>

        <img src={ isMessageBoxExpanded ? '/collapse-icon.svg' : '/expand-icon.svg' }></img>

        <input id='message-box-toggle-expand-button' type='button' value={ isMessageBoxExpanded ? 'Collapse' : 'Expand' } onClick={ handleToggleExpandOnClick }></input>
      </header>

      {
        isMessageBoxExpanded ?
          <ul id='message-box-all-conversations-ul'>
            { Object.keys(messages).map(generateMessagesBetweenUser) }
          </ul>
        :
          null
      }
    </aside>
  )
}

export default MessageComponent