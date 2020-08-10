import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledList = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  margin: 40px 0;
`;

export default function List(props) {
  const { children } = props;

  return <StyledList>{children}</StyledList>;
}

List.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
};

List.defaultProps = {
  children: <div />,
};
