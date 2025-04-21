import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import styled from 'styled-components';
import useConversations from '../hooks/useConversations';
import { formatDate } from '../utils/date';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const Filter = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background.light};
  }
`;

const ConversationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const ConversationCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardDate = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.light};
`;

const CardContent = styled.div`
  padding: 16px;
  background-color: ${props => props.theme.colors.background.light};
  min-height: 120px;
`;

const MessagePreview = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin-bottom: 8px;
`;

const MessageCount = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.light};
`;

const CardFooter = styled.div`
  padding: 12px 16px;
  background-color: white;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ViewButton = styled(Link)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: ${props => props.theme.borderRadius.small};
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 0;
  color: ${props => props.theme.colors.text.light};
`;

const History = () => {
  const { conversations, applyFilter } = useConversations();
  const [activeFilter, setActiveFilter] = useState(0);
  const [filteredConversations, setFilteredConversations] = useState([]);
  
  const filterOptions = [
    { label: 'All', value: null },
    { label: '5 Star', value: 5 },
    { label: '4 Star', value: 4 },
    { label: '3 Star', value: 3 },
    { label: '2 Star', value: 2 },
    { label: '1 Star', value: 1 }
  ];
  
  // Filter conversations when the active filter changes
  useEffect(() => {
    if (activeFilter === 0) {
      // Show all conversations
      setFilteredConversations(conversations);
    } else {
      // Filter by rating
      const rating = filterOptions[activeFilter].value;
      const filtered = conversations.filter(conv => conv.rating === rating);
      setFilteredConversations(filtered);
    }
  }, [activeFilter, conversations]);
  
  const handleFilterChange = (rating, index) => {
    applyFilter({ rating });
    setActiveFilter(index);
  };
  
  // Sort conversations by date (newest first)
  const sortedConversations = [...filteredConversations].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  return (
    <PageContainer>
      <Header>
        <Title>Conversation History</Title>
        <BackLink href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Chat
        </BackLink>
      </Header>
      
      <FiltersContainer>
        {filterOptions.map((filter, index) => (
          <Filter
            key={index}
            active={activeFilter === index}
            onClick={() => handleFilterChange(filter.value, index)}
          >
            {filter.label}
          </Filter>
        ))}
      </FiltersContainer>
      
      {sortedConversations.length === 0 ? (
        <EmptyState>
          <h3>No conversations found</h3>
          <p>Start a new chat to create some history</p>
        </EmptyState>
      ) : (
        <ConversationGrid>
          {sortedConversations.map(conversation => (
            <ConversationCard key={conversation.id}>
              <CardHeader>
                <CardTitle>{conversation.title}</CardTitle>
                <CardDate>{formatDate(conversation.updatedAt)}</CardDate>
              </CardHeader>
              
              <CardContent>
                {conversation.messages.length > 0 ? (
                  <>
                    <MessagePreview>
                      {conversation.messages[0].content}
                    </MessagePreview>
                    <MessageCount>
                      {conversation.messages.length} messages
                    </MessageCount>
                  </>
                ) : (
                  <MessagePreview>No messages yet</MessagePreview>
                )}
              </CardContent>
              
              <CardFooter>
                <RatingDisplay>
                  {conversation.rating ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="none"
                        style={{ color: '#FFC107' }}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      {conversation.rating}/5
                    </>
                  ) : (
                    'Not rated'
                  )}
                </RatingDisplay>
                
                <ViewButton href={`/?id=${conversation.id}`}>
                  View Chat
                </ViewButton>
              </CardFooter>
            </ConversationCard>
          ))}
        </ConversationGrid>
      )}
    </PageContainer>
  );
};

export default History;