import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledTextBlock = styled.p`
  font-size: 1.2rem;
  line-height: 2.4em;
  font-weight: normal;
  color: ${(props) => props.color};
  text-align: left;
  letter-spacing: -0.05em;
  padding: 60px 20px;
  margin: 0;
  @media only screen and (min-device-width: 568px) {
    font-size: 1.6rem;
    padding: ${(props) => (props.paddingSize === 'big' ? '60px 90px' : '60px')};
  }
  @media only screen and (min-device-width: 768px) {
    font-size: 1.6rem;
  }
`;

export default function TextBlock(props) {
  const { color, paddingSize, children } = props;

  return (
    <StyledTextBlock color={color} paddingSize={paddingSize}>
      {children}
    </StyledTextBlock>
  );
}

TextBlock.propTypes = {
  color: PropTypes.string,
  paddingSize: PropTypes.string,
  children: PropTypes.string,
};

TextBlock.defaultProps = {
  color: '#f5f5f5',
  paddingSize: 'small',
  children: '',
};
