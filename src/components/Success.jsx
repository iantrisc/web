import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledSuccess = styled.p`
  font-size: 0.8rem;
  background-color: #048200;
  padding: 10px 15px;
  text-align: center;
`;

export default function Success(props) {
  const { children } = props;

  return <StyledSuccess>{children}</StyledSuccess>;
}

Success.propTypes = {
  children: PropTypes.string.isRequired,
};
