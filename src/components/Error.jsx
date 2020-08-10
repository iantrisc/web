import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledError = styled.p`
  font-size: 0.8rem;
  background-color: #e61212;
  padding: 10px 15px;
  text-align: center;
`;

export default function Error(props) {
  const { children } = props;

  return <StyledError>{children}</StyledError>;
}

Error.propTypes = {
  children: PropTypes.string.isRequired,
};
