/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

const blinkCaret = keyframes`
  from, 
  to { 
    border-color: transparent; 
  }
  50% { 
    border-color: #000; 
  }
`;

const StyledTitle = styled.div`
  display: inline-block;
  width: auto;
  background-color: #fff;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 25px;
  padding-left: 10px;
  margin: 15px 0;
`;

const Heading = styled.h2`
  font-size: 2rem;
  line-height: 0.79em;
  font-weight: normal;
  color: ${(props) => props.color};
  text-align: ${(props) => props.textAlign};
  text-transform: uppercase;
  letter-spacing: -0.05em;
  background-color: #fff;
  border-right: 0.15em solid ${(props) => props.color};
  padding-right: 8px;
  margin: 0;
  @media only screen and (min-device-width: 768px) {
    font-size: 3rem;
    line-height: 0.8em;
  }
  animation: ${blinkCaret} 0.75s infinite;
`;

export default function Title(props) {
  const { color, textAlign, children } = props;

  return (
    <StyledTitle>
      <Heading color={color} textAlign={textAlign}>
        {children}
      </Heading>
    </StyledTitle>
  );
}

Title.propTypes = {
  color: PropTypes.string,
  textAlign: PropTypes.string,
  children: PropTypes.string,
};

Title.defaultProps = {
  color: '#000',
  textAlign: 'left',
  children: '',
};
