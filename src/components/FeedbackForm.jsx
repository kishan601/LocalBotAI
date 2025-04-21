import React, { useState } from 'react';
import styled from 'styled-components';
import RatingControl from './RatingControl';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormHeader = styled.div`
  text-align: center;
`;

const FormTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 4px;
`;

const FormSubtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.text.light};
`;

const RatingContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const TextareaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: ${props => props.theme.fontSizes.small};
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const Textarea = styled.textarea`
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const FeedbackForm = ({ onSubmitFeedback }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitFeedback(rating, feedback);
  };
  
  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormHeader>
        <FormTitle>How was your experience?</FormTitle>
        <FormSubtitle>Your feedback helps us improve</FormSubtitle>
      </FormHeader>
      
      <RatingContainer>
        <RatingControl 
          initialRating={rating} 
          onRatingChange={setRating}
          size="large"
        />
      </RatingContainer>
      
      <TextareaContainer>
        <Label htmlFor="feedback">
          Additional feedback (optional)
        </Label>
        <Textarea
          id="feedback"
          rows={3}
          placeholder="Tell us more about your experience..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </TextareaContainer>
      
      <ButtonContainer>
        <SubmitButton type="submit">
          Submit Feedback
        </SubmitButton>
      </ButtonContainer>
    </FormContainer>
  );
};

export default FeedbackForm;