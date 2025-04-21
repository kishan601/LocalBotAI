import React from 'react';
import styled from 'styled-components';

const RatingContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  
  &:focus {
    outline: none;
  }
  
  svg {
    width: ${props => {
      switch(props.size) {
        case 'small': return '16px';
        case 'large': return '32px';
        default: return '24px';
      }
    }};
    height: ${props => {
      switch(props.size) {
        case 'small': return '16px';
        case 'large': return '32px';
        default: return '24px';
      }
    }};
    color: ${props => props.filled ? '#FFC107' : '#E0E0E0'};
  }
`;

/**
 * Rating control component
 * @param {Object} props
 * @param {number} [props.initialRating] - Initial rating
 * @param {Function} props.onRatingChange - Rating change handler
 * @param {'small'|'medium'|'large'} [props.size] - Size of stars
 */
const RatingControl = ({ 
  initialRating = 0, 
  onRatingChange,
  size = 'medium'
}) => {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <RatingContainer>
      {stars.map((star) => (
        <StarButton
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          filled={star <= initialRating}
          size={size}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={star <= initialRating ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </StarButton>
      ))}
    </RatingContainer>
  );
};

export default RatingControl;