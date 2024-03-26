import React, { useContext, useState } from 'react'; // Import useState
import MessageContext from '../../context/MessageContext';
import '../../css/aside/MessageComponent.css';

const MessageComponent = () => {
  const { messages, setMessages, isMessageBoxExpanded, setIsMessageBoxExpanded, selectedConversation, setSelectedConversation, messageToSend, setMessageToSend } = useContext(MessageContext);
  const [newUser, setNewUser] = useState(''); // Add state for new user

  const handleToggleExpandOnClick = () => {
    setIsMessageBoxExpanded(!isMessageBoxExpanded);
  };

  const handleConversationButtonOnClick = (e) => {
    const selected = e.target.value;
    setSelectedConversation(selectedConversation === selected ? '' : selected);
  };

  const handleEnterMessageOnChange = (e) => {
    setMessageToSend(e.target.value);
  };

  const handleEnterMessageOnKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (messageToSend) {
        setMessages((oldMessages) => {
          const newMessages = { ...oldMessages };

          const delimiterIndex = e.target.id.indexOf('-textarea');
          const usernameKey = e.target.id.substring(0, delimiterIndex);

          newMessages[usernameKey] = [
            ...newMessages[usernameKey],
            { id: newMessages[usernameKey].length + 1, content: messageToSend, originator: 'self' }
          ];

          return newMessages;
        });

        setMessageToSend('');
      }
    }
  };

  const generateConversationUser = (otherUsername) => {
    return (
      <li key={`${otherUsername}-conversation-item`} className='message-box-conversation-list-item'>
        <button className={(otherUsername === selectedConversation ? 'selected-conversation-button ' : '') + 'message-box-conversation-button'} value={otherUsername} onClick={handleConversationButtonOnClick}>
          {otherUsername}
        </button>
      </li>
    );
  };

  const generateSelectedConversation = (message) => {
    return (
      <li key={message.id} id={`${message.id}-message-item`} className={(message.originator === 'self' ? 'sent-message-item' : 'received-message-item') + ' message-item'}>
        {message.content}
      </li>
    );
  };

  const handleAddUserButtonOnClick = (e) => {
    e.preventDefault();
    if (newUser.trim() !== '' && !messages[newUser]) {
      setMessages((oldMessages) => {
        const newMessages = { ...oldMessages };
        newMessages[newUser] = [];
        return newMessages;
      });
      setNewUser('');
    }
  };

  return (
    <aside id='message-box'>
      <header id='message-box-header'>
        <h3 id='message-box-h3'>Messages</h3>

        {isMessageBoxExpanded ? (
          // src: /icons/collapse-icon.svg
          <svg fill='currentColor' xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
            <path d='M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z' />
          </svg>
        ) : (
          // src: /icons/expand-icon.svg'
          <svg fill='currentColor' xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'>
            <path d='m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z' />
          </svg>
        )}

        <button id='message-box-toggle-expand-button' type='button' onClick={handleToggleExpandOnClick}>
          {isMessageBoxExpanded ? 'Collapse' : 'Expand'}
        </button>
      </header>

      {isMessageBoxExpanded ? (
        <section id='message-box-conversations-section'>
          <h3 hidden>Conversations</h3>

          <section id='message-box-conversation-users-section'>
            <h4 hidden>Conversation Users</h4>

            <form id='message-box-user-search-form' autoComplete='off'>
              <fieldset id='message-box-user-search-fieldset'>
                <legend id='add-conversation-legend'>Add Conversation</legend>

                <input
                  id='message-box-user-search-input'
                  placeholder='enter username'
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                />
                <button id='message-box-add-user-button' type='submit' onClick={handleAddUserButtonOnClick}>
                  Add
                </button>
              </fieldset>
            </form>

            <section id='active-conversations-section'>
              <h5 id='active-conversations-heading'>Active Conversations</h5>

              <ul id='message-box-conversation-users-ul'>{Object.keys(messages).map(generateConversationUser)}</ul>
            </section>
          </section>

          {messages[selectedConversation] ? (
            <section id='message-box-selected-user-conversation-section'>
              <h4 hidden>Selected Conversation</h4>

              <ul id='message-box-selected-user-conversation-ul'>{messages[selectedConversation].map(generateSelectedConversation)}</ul>

              <form autoComplete='off'>
                <textarea
                  id={`${selectedConversation}-textarea`}
                  className='message-box-textarea'
                  placeholder='enter message'
                  value={messageToSend}
                  onChange={handleEnterMessageOnChange}
                  onKeyDown={handleEnterMessageOnKeyDown}
                ></textarea>
              </form>
            </section>
          ) : (
            <p id='no-selected-conversation-p'>Select a Conversation</p>
          )}
        </section>
      ) : null}
    </aside>
  );
};

export default MessageComponent;