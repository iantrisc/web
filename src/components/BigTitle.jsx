import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledBigTitle = styled.h1`
  font-size: 4rem;
  line-height: 0.74em;
  font-weight: bold;
  color: ${(props) => props.color};
  text-align: ${(props) => props.textAlign};
  text-transform: uppercase;
  letter-spacing: -0.05em;
  margin: 0;
  @media only screen and (min-device-width: 768px) {
    font-size: 6rem;
  }
`;

export default function BigTitle(props) {
  const { color, textAlign, children } = props;

  return (
    <StyledBigTitle color={color} textAlign={textAlign}>
      {children}
    </StyledBigTitle>
  );
}

BigTitle.propTypes = {
  color: PropTypes.string,
  textAlign: PropTypes.string,
  children: PropTypes.string,
};

BigTitle.defaultProps = {
  color: '#fff',
  textAlign: 'left',
  children: '',
};
