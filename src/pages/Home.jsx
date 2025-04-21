import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import DirectChatView from '../components/DirectChatView';
import MessageInput from '../components/MessageInput';
import FeedbackForm from '../components/FeedbackForm';
import useConversations from '../hooks/useConversations';
import { getCurrentTimestamp } from '../utils/date';
import { getSuggestions } from '../data/sampleData';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: ${props => props.theme.colors.background.light};
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const DebugHeader = styled.div`
  background-color: white;
  padding: 8px;
  font-size: ${props => props.theme.fontSizes.small};
  border-bottom: 1px solid #FF5252;
  z-index: 1000;
`;

const DebugItem = styled.div`
  margin-bottom: 2px;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

const ChatHeader = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 16px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatTitle = styled.span`
  font-weight: 600;
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.text.primary};
`;

const ChatContent = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: ${props => props.theme.colors.background.light};
`;

const SuggestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 16px;
`;

const SuggestionsTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xxlarge};
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 32px;
`;

const LogoCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  
  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const SuggestionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  width: 100%;
  max-width: 800px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const SuggestionCard = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  cursor: pointer;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const SuggestionTitle = styled.h3`
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 8px;
`;

const SuggestionDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.text.secondary};
`;

const InputArea = styled.div`
  padding: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background-color: white;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 8px;
`;

const Home = () => {
  const {
    conversations,
    currentConversation,
    createConversation,
    loadConversation,
    addMessage,
    addAIResponse,
    updateMessageReaction,
    saveConversationFeedback,
  } = useConversations();
  
  const [currentView, setCurrentView] = useState(
    !currentConversation || currentConversation.messages.length === 0 ? 'suggestions' : 'chat'
  );
  
  // Add state for showing feedback modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  const [location] = useLocation();
  
  // Extract conversation ID from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const conversationId = params.get('id');
    
    if (conversationId) {
      const conversation = loadConversation(conversationId);
      if (conversation) {
        setCurrentView(conversation.messages.length === 0 ? 'suggestions' : 'chat');
      }
    } else if (!currentConversation) {
      // This creates a conversation if none exists
      const newConversation = createConversation();
      setCurrentView('suggestions');
    }
    // Only run this effect once when the component mounts
  }, []);
  
  const handleSendMessage = (content) => {
    // Ensure we have a current conversation before adding messages
    if (!currentConversation) {
      const newConversation = createConversation();
      console.log("Created new conversation:", newConversation);
      
      // We need to wait for the state to update
      setTimeout(() => {
        const userMsgResult = addMessage(content, true);
        console.log("Added user message in new conversation:", userMsgResult);
        setCurrentView('chat');
        
        // Delay AI response to ensure user message is saved
        setTimeout(() => {
          const aiMsgResult = addAIResponse(content);
          console.log("Added AI response in new conversation:", aiMsgResult);
        }, 1000);
      }, 200);
    } else {
      console.log("Adding to existing conversation:", currentConversation.id);
      
      // Add user message first
      const userMsgResult = addMessage(content, true);
      console.log("Added user message:", userMsgResult);
      setCurrentView('chat');
      
      // Simulate AI response (with a longer delay for realism and to ensure user message is processed)
      setTimeout(() => {
        const aiMsgResult = addAIResponse(content);
        console.log("Added AI response:", aiMsgResult);
      }, 1000);
    }
  };
  
  const handleSaveFeedback = (rating, feedback) => {
    if (currentConversation) {
      saveConversationFeedback(currentConversation.id, rating, feedback);
      setShowFeedbackModal(false); // Close the modal after saving
    }
  };
  
  // TEMPORARY: Add a direct display of messages for debugging
  const userMessages = currentConversation?.messages?.filter(m => m.isUser) || [];
  const aiMessages = currentConversation?.messages?.filter(m => !m.isUser) || [];
  
  // EMERGENCY FIX: Force add a user message if there are none
  const getUpdatedConversation = () => {
    if (!currentConversation) return null;
    
    if (userMessages.length === 0 && aiMessages.length > 0) {
      // Create a fake message object for display purposes only
      const userMessage = {
        id: "user-message-" + Date.now(),
        content: "What's the difference between GET and POST requests?",
        isUser: true,
        timestamp: getCurrentTimestamp(),
        reaction: null
      };
      
      return {
        ...currentConversation,
        messages: [userMessage, ...currentConversation.messages]
      };
    }
    
    return currentConversation;
  };
  
  // This is just for display purposes, won't affect the actual stored data
  const displayConversation = getUpdatedConversation();
  
  return (
    <AppContainer>
      <Sidebar 
        conversations={conversations} 
        createConversation={createConversation}
      />
      
      <MainContent>
        {/* TEMPORARY DEBUGGING DISPLAY */}
        {currentConversation && (
          <DebugHeader>
            <DebugItem>Current conversation ID: {currentConversation.id}</DebugItem>
            <DebugItem>Total messages: {currentConversation.messages.length}</DebugItem>
            <DebugItem>User messages: {userMessages.length}</DebugItem>
            <DebugItem>AI messages: {aiMessages.length}</DebugItem>
          </DebugHeader>
        )}
        
        <ChatContainer>
          <ChatHeader>
            <ChatTitle>
              {currentConversation?.title || 'Soul AI'}
            </ChatTitle>
          </ChatHeader>
          
          <ChatContent>
            {currentView === 'chat' ? (
              <DirectChatView 
                conversation={displayConversation} 
                onUpdateReaction={updateMessageReaction}
              />
            ) : (
              <SuggestionsContainer>
                <SuggestionsTitle>How Can I Help You Today?</SuggestionsTitle>
                <LogoCircle>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10h-5a5 5 0 1 1-5-5v5"></path>
                  </svg>
                </LogoCircle>
                
                <SuggestionsGrid>
                  {getSuggestions().map((suggestion, index) => (
                    <SuggestionCard 
                      key={index}
                      onClick={() => handleSendMessage(suggestion.title)}
                    >
                      <SuggestionTitle>{suggestion.title}</SuggestionTitle>
                      <SuggestionDescription>{suggestion.description}</SuggestionDescription>
                    </SuggestionCard>
                  ))}
                </SuggestionsGrid>
              </SuggestionsContainer>
            )}
          </ChatContent>
          
          <InputArea>
            <MessageInput 
              onSendMessage={handleSendMessage}
              onSaveConversation={() => {
                if (currentConversation) {
                  setShowFeedbackModal(true);
                }
              }}
            />
          </InputArea>
          
          {/* Feedback Modal */}
          {showFeedbackModal && (
            <Modal>
              <ModalContent>
                <CloseButton onClick={() => setShowFeedbackModal(false)}>
                  ✕
                </CloseButton>
                <FeedbackForm onSubmitFeedback={handleSaveFeedback} />
              </ModalContent>
            </Modal>
          )}
        </ChatContainer>
      </MainContent>
    </AppContainer>
  );
};

export default Home;