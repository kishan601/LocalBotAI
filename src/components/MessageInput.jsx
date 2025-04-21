import React, { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const InputContainer = styled.div`
  flex: 1;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.primary ? props.theme.colors.primary : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : props.theme.colors.text.secondary};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.primary ? props.theme.colors.primaryHover : '#e0e0e0'};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

/**
 * Message input component
 * @param {Object} props
 * @param {Function} props.onSendMessage - Send message handler
 * @param {Function} props.onSaveConversation - Save conversation handler
 * @param {string} [props.placeholder] - Input placeholder
 */
const MessageInput = ({ 
  onSendMessage, 
  onSaveConversation,
  placeholder = 'Message Bot AI...'
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    console.log("Sending message:", message);
    onSendMessage(message.trim());
    setMessage('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputContainer>
        <StyledInput
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </InputContainer>
      <ButtonsContainer>
        <IconButton
          type="button"
          onClick={onSaveConversation}
          title="Save conversation"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
        </IconButton>
        <IconButton
          type="submit"
          primary
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </IconButton>
      </ButtonsContainer>
    </Form>
  );
};

export default MessageInput;