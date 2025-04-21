/**
 * @typedef {Object} Message
 * @property {string} id - Message ID
 * @property {string} content - Message content
 * @property {boolean} isUser - Whether the message is from the user
 * @property {string} timestamp - Timestamp string
 * @property {('like'|'dislike'|null)} [reaction] - User reaction to AI message
 */

/**
 * @typedef {Object} Conversation
 * @property {string} id - Conversation ID
 * @property {string} title - Conversation title
 * @property {Message[]} messages - Array of messages
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Update timestamp
 * @property {number} [rating] - User rating
 * @property {string} [feedback] - User feedback
 */

const CONVERSATIONS_KEY = 'bot_ai_conversations';

/**
 * Load conversations from localStorage
 * @returns {Conversation[]} Array of conversations
 */
export const loadConversations = () => {
  const stored = localStorage.getItem(CONVERSATIONS_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse stored conversations:', error);
    return [];
  }
};

/**
 * Save conversations to localStorage
 * @param {Conversation[]} conversations - Array of conversations to save
 */
export const saveConversations = (conversations) => {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
};

/**
 * Get a conversation by ID
 * @param {string} id - Conversation ID to find
 * @returns {Conversation|undefined} Found conversation or undefined
 */
export const getConversation = (id) => {
  const conversations = loadConversations();
  return conversations.find(conv => conv.id === id);
};

/**
 * Save a new conversation or update an existing one
 * @param {Conversation} conversation - Conversation to save
 */
export const saveConversation = (conversation) => {
  const conversations = loadConversations();
  const index = conversations.findIndex(conv => conv.id === conversation.id);
  
  if (index >= 0) {
    conversations[index] = conversation;
  } else {
    conversations.push(conversation);
  }
  
  saveConversations(conversations);
};

/**
 * Update an existing conversation
 * @param {string} id - Conversation ID to update
 * @param {Partial<Conversation>} updates - Object with updates to apply
 * @returns {Conversation|undefined} Updated conversation or undefined if not found
 */
export const updateConversation = (id, updates) => {
  const conversations = loadConversations();
  const index = conversations.findIndex(conv => conv.id === id);
  
  if (index === -1) return undefined;
  
  const updated = { ...conversations[index], ...updates, updatedAt: new Date().toISOString() };
  conversations[index] = updated;
  saveConversations(conversations);
  
  return updated;
};

/**
 * Update a message reaction
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID
 * @param {('like'|'dislike'|null)} reaction - Reaction to set
 */
export const updateMessageReaction = (conversationId, messageId, reaction) => {
  const conversations = loadConversations();
  const convIndex = conversations.findIndex(conv => conv.id === conversationId);
  
  if (convIndex === -1) return;
  
  const conversation = conversations[convIndex];
  const messageIndex = conversation.messages.findIndex(msg => msg.id === messageId);
  
  if (messageIndex === -1) return;
  
  conversation.messages[messageIndex].reaction = reaction;
  conversation.updatedAt = new Date().toISOString();
  
  conversations[convIndex] = conversation;
  saveConversations(conversations);
};

/**
 * Delete a conversation
 * @param {string} id - Conversation ID to delete
 * @returns {boolean} Whether deletion was successful
 */
export const deleteConversation = (id) => {
  const conversations = loadConversations();
  const filtered = conversations.filter(conv => conv.id !== id);
  
  if (filtered.length === conversations.length) return false;
  
  saveConversations(filtered);
  return true;
};

/**
 * Filter conversations by rating
 * @param {number} [rating] - Rating to filter by
 * @returns {Conversation[]} Filtered conversations
 */
export const filterConversationsByRating = (rating) => {
  const conversations = loadConversations();
  
  if (rating === undefined) return conversations;
  
  return conversations.filter(conv => conv.rating === rating);
};