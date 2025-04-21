import React from 'react';
import { Link, useLocation } from 'wouter';
import styled from 'styled-components';
import { formatDate } from '../utils/date';

const SidebarContainer = styled.div`
  width: 256px;
  background-color: white;
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SidebarHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Logo = styled.div`
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.xlarge};
  display: flex;
  align-items: center;
  
  svg {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    color: ${props => props.theme.colors.primary};
  }
`;

const NewChatButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
  
  svg {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`;

const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const SectionTitle = styled.div`
  padding: 8px 12px;
  font-size: ${props => props.theme.fontSizes.small};
  font-weight: 600;
  color: ${props => props.theme.colors.text.light};
  text-transform: uppercase;
`;

const ConversationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
`;

const ConversationItem = styled.a`
  display: block;
  padding: 8px;
  border-radius: ${props => props.theme.borderRadius.small};
  text-decoration: none;
  
  &:hover {
    background-color: ${props => props.theme.colors.background.light};
  }
`;

const ConversationTitle = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ConversationMeta = styled.div`
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.text.light};
`;

const SidebarFooter = styled.div`
  padding: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const FooterLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 8px;
  color: ${props => props.theme.colors.text.primary};
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.small};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.light};
  }
  
  svg {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`;

/**
 * Sidebar component
 * @param {Object} props
 * @param {Array} props.conversations - Conversations list
 * @param {Function} props.createConversation - Create new conversation handler
 */
const Sidebar = ({ conversations, createConversation }) => {
  const [location, setLocation] = useLocation();
  
  const handleNewChat = () => {
    const newConversation = createConversation();
    setLocation(`/?id=${newConversation.id}`);
  };
  
  return (
    <SidebarContainer>
      <SidebarHeader>
        <Logo>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Soul AI
        </Logo>
      </SidebarHeader>
      
      <div style={{ padding: '16px' }}>
        <NewChatButton onClick={handleNewChat}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Chat
        </NewChatButton>
      </div>
      
      <ConversationList>
        <SectionTitle>Recent Conversations</SectionTitle>
        <ConversationsContainer>
          {conversations.map((conversation) => (
            <ConversationItem 
              key={conversation.id} 
              href={`/?id=${conversation.id}`}
            >
              <ConversationTitle>
                {conversation.title}
              </ConversationTitle>
              <ConversationMeta>
                {formatDate(conversation.updatedAt)} • {conversation.messages.length} messages
              </ConversationMeta>
            </ConversationItem>
          ))}
        </ConversationsContainer>
      </ConversationList>
      
      <SidebarFooter>
        <FooterLink href="/history">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          History
        </FooterLink>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;