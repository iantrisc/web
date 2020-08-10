import React from 'react';
import styled, { keyframes } from 'styled-components';

const typing = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const blinkCaret = keyframes`
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: white;
  }
`;

const StyledLoading = styled.div`
  width: 105px;
  margin: 0 auto;
`;

const Typewriter = styled.div`
  overflow: hidden;
  border-right: 0.15em solid white;
  white-space: nowrap;
  margin: 0 auto;
  letter-spacing: 0.15em;
  animation: ${typing} 3.5s steps(20, end) infinite,
    ${blinkCaret} 0.75s step-end infinite;
`;

export default function Loading() {
  return (
    <StyledLoading>
      <Typewriter>Loading...</Typewriter>
    </StyledLoading>
  );
}
