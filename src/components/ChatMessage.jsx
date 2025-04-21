import React from 'react';
import styled from 'styled-components';
import { formatTimestamp } from '../utils/date';

const MessageContainer = styled.div`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 16px;
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 12px;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.isUser 
    ? props.theme.colors.background.userMessage 
    : props.theme.colors.background.aiMessage};
`;

const MessageSender = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const MessageContent = styled.div`
  color: ${props => props.theme.colors.text.primary};
  white-space: pre-wrap;
  word-break: break-word;
`;

const MessageTime = styled.div`
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.text.light};
  margin-top: 4px;
`;

const ReactionButtons = styled.div`
  display: flex;
  margin-top: 8px;
  gap: 8px;
`;

const ReactionButton = styled.button`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 16px;
  border: none;
  font-size: ${props => props.theme.fontSizes.small};
  cursor: pointer;
  background-color: ${props => 
    props.active 
      ? (props.type === 'like' ? props.theme.colors.reactionLike : props.theme.colors.reactionDislike) + '20'
      : '#f0f0f0'
  };
  color: ${props => 
    props.active 
      ? (props.type === 'like' ? props.theme.colors.reactionLike : props.theme.colors.reactionDislike)
      : props.theme.colors.text.secondary
  };
  
  &:hover {
    background-color: ${props => 
      props.type === 'like' 
        ? props.theme.colors.reactionLike + '20' 
        : props.theme.colors.reactionDislike + '20'
    };
  }
`;

/**
 * Chat message component
 * @param {Object} props
 * @param {Object} props.message - Message object
 * @param {Function} [props.onReaction] - Reaction handler
 */
const ChatMessage = ({ message, onReaction }) => {
  return (
    <MessageContainer isUser={message.isUser}>
      <MessageBubble isUser={message.isUser}>
        <MessageSender>
          {message.isUser ? 'You' : 'Soul AI'}
        </MessageSender>
        <MessageContent>
          {message.content}
        </MessageContent>
        <MessageTime>
          {formatTimestamp(message.timestamp)}
        </MessageTime>
        
        {!message.isUser && onReaction && (
          <ReactionButtons>
            <ReactionButton
              type="like"
              active={message.reaction === 'like'}
              onClick={() => onReaction(message.id, message.reaction === 'like' ? null : 'like')}
            >
              👍 Like
            </ReactionButton>
            <ReactionButton
              type="dislike"
              active={message.reaction === 'dislike'}
              onClick={() => onReaction(message.id, message.reaction === 'dislike' ? null : 'dislike')}
            >
              👎 Dislike
            </ReactionButton>
          </ReactionButtons>
        )}
      </MessageBubble>
    </MessageContainer>
  );
};

export default ChatMessage;