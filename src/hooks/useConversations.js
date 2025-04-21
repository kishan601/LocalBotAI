import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as storageUtils from '../utils/storage';
import { getCurrentTimestamp } from '../utils/date';
import { findResponseForQuestion } from '../data/sampleData';

/**
 * Custom hook for managing conversations
 * @returns {Object} Conversation methods and state
 */
const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  
  // Load conversations from localStorage on mount
  useEffect(() => {
    const loadedConversations = storageUtils.loadConversations();
    setConversations(loadedConversations);
  }, []);
  
  const [currentConversation, setCurrentConversation] = useState(null);
  const [filter, setFilter] = useState({});

  // Get filtered conversations based on current filter
  const filteredConversations = useCallback(() => {
    if (!filter.rating) return conversations;
    return conversations.filter(conv => conv.rating === filter.rating);
  }, [conversations, filter]);

  // Create a new conversation
  const createConversation = useCallback(() => {
    const newConversation = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversation(newConversation);
    storageUtils.saveConversation(newConversation);
    
    return newConversation;
  }, []);

  // Load an existing conversation
  const loadConversation = useCallback((id) => {
    const conversation = storageUtils.getConversation(id);
    if (conversation) {
      setCurrentConversation(conversation);
      return conversation;
    }
    return null;
  }, []);

  // Add a message to the current conversation
  const addMessage = useCallback((content, isUser) => {
    if (!currentConversation) {
      console.error("No active conversation to add message to");
      return;
    }

    const newMessage = {
      id: uuidv4(),
      content,
      isUser,
      timestamp: getCurrentTimestamp(),
      reaction: null
    };
    
    console.log(`Adding ${isUser ? 'user' : 'AI'} message:`, content);
    
    // CRITICAL FIX: Use direct reference to current conversation from localStorage to prevent stale state
    const freshConversation = storageUtils.getConversation(currentConversation.id) || currentConversation;
    
    console.log("Before adding message, current conversation:", {...freshConversation});
    
    // Make absolutely sure we're working with the correct data
    const currentMessages = freshConversation.messages || [];
    const updatedMessages = [...currentMessages, newMessage];
    
    console.log("Messages after adding:", updatedMessages);
    
    // Create a completely new conversation object
    const updatedConversation = {
      ...freshConversation,
      messages: updatedMessages,
      updatedAt: getCurrentTimestamp(),
      // Update title if this is the first user message or New Chat
      title: (freshConversation.title === 'New Chat' && isUser) ? 
        (content.length > 20 ? `${content.substring(0, 20)}...` : content) : 
        freshConversation.title
    };
    
    console.log("Updated conversation:", updatedConversation);
    
    // Save to localStorage FIRST to prevent any race conditions
    storageUtils.saveConversation(updatedConversation);
    
    // Then update React state
    setCurrentConversation(updatedConversation);
    
    // Update the conversations array with our updated conversation
    setConversations(prev => {
      const existingIndex = prev.findIndex(c => c.id === updatedConversation.id);
      if (existingIndex >= 0) {
        const newArray = [...prev];
        newArray[existingIndex] = updatedConversation;
        return newArray;
      } else {
        return [...prev, updatedConversation];
      }
    });
    
    return newMessage;
  }, [currentConversation]);

  // Add an AI response
  const addAIResponse = useCallback((userMessage) => {
    // Get response from sample data
    const response = findResponseForQuestion(userMessage);
    
    return addMessage(response, false);
  }, [addMessage]);

  // Update a message reaction
  const updateMessageReaction = useCallback((messageId, reaction) => {
    if (!currentConversation) return;
    
    const updatedMessages = currentConversation.messages.map(msg => 
      msg.id === messageId ? { ...msg, reaction } : msg
    );
    
    const updatedConversation = {
      ...currentConversation,
      messages: updatedMessages,
      updatedAt: getCurrentTimestamp()
    };
    
    setCurrentConversation(updatedConversation);
    setConversations(prev => 
      prev.map(conv => conv.id === currentConversation.id ? updatedConversation : conv)
    );
    
    storageUtils.updateMessageReaction(currentConversation.id, messageId, reaction);
  }, [currentConversation]);

  // Save feedback for a conversation
  const saveConversationFeedback = useCallback((id, rating, feedback) => {
    const updatedConversation = storageUtils.updateConversation(id, { rating, feedback });
    
    if (updatedConversation) {
      setCurrentConversation(updatedConversation);
      setConversations(prev => 
        prev.map(conv => conv.id === id ? updatedConversation : conv)
      );
    }
    
    return updatedConversation;
  }, []);

  // Apply filter to conversations
  const applyFilter = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  // Ensure conversations are saved to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      storageUtils.saveConversations(conversations);
    }
  }, [conversations]);

  return {
    conversations,
    filteredConversations: filteredConversations(),
    currentConversation,
    createConversation,
    loadConversation,
    addMessage,
    addAIResponse,
    updateMessageReaction,
    saveConversationFeedback,
    applyFilter,
    filter
  };
};

export default useConversations;