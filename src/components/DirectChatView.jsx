import React from 'react';
import styled from 'styled-components';
import ChatMessage from './ChatMessage';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow-y: auto;
  height: 100%;
`;

const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${props => props.theme.colors.text.light};
  text-align: center;
`;

/**
 * Direct chat view component
 * @param {Object} props
 * @param {Object|null} props.conversation - Conversation object
 * @param {Function} [props.onUpdateReaction] - Reaction update handler
 */
const DirectChatView = ({ conversation, onUpdateReaction }) => {
  if (!conversation || !conversation.messages || conversation.messages.length === 0) {
    return (
      <EmptyMessage>
        No messages to display. Start a conversation!
      </EmptyMessage>
    );
  }

  return (
    <ChatContainer>
      {conversation.messages.map((message) => (
        <ChatMessage 
          key={message.id}
          message={message}
          onReaction={onUpdateReaction}
        />
      ))}
    </ChatContainer>
  );
};

export default DirectChatView;