import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

const blinkCaret = keyframes`
  from, 
  to { 
    border-color: transparent; 
  }
  50% { 
    border-color: #fff; 
  }
`;

const StyledTypewriterTitle = styled.div`
  text-align: ${(props) => props.textAlign};
`;

const Heading = styled.h2`
  display: inline-block;
  width: auto;
  font-size: 2rem;
  line-height: 0.79em;
  font-weight: normal;
  color: ${(props) => props.color};
  text-align: ${(props) => props.textAlign};
  text-transform: uppercase;
  letter-spacing: -0.05em;
  border-right: 0.15em solid ${(props) => props.color};
  padding-right: 8px;
  margin: 0;
  @media only screen and (min-device-width: 768px) {
    font-size: 3rem;
    line-height: 0.72em;
  }
  animation: ${blinkCaret} 0.75s infinite;
`;

export default function TypewriterTitle(props) {
  const { color, textAlign, children } = props;

  return (
    <StyledTypewriterTitle color={color} textAlign={textAlign}>
      <Heading>{children}</Heading>
    </StyledTypewriterTitle>
  );
}

TypewriterTitle.propTypes = {
  color: PropTypes.string,
  textAlign: PropTypes.string,
  children: PropTypes.string,
};

TypewriterTitle.defaultProps = {
  color: '#fff',
  textAlign: 'left',
  children: '',
};
