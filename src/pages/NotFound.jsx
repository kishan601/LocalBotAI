import React from 'react';
import { Link } from 'wouter';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 72px;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.primary};
`;

const Subtitle = styled.h2`
  font-size: 24px;
  margin-bottom: 40px;
  color: ${props => props.theme.colors.text.primary};
`;

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: 500;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const NotFound = () => {
  return (
    <Container>
      <Title>404</Title>
      <Subtitle>Oops! Page not found</Subtitle>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <br />
      <StyledLink href="/">Back to Home</StyledLink>
    </Container>
  );
};

export default NotFound;