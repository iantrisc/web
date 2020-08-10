import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledListItem = styled.button`
  color: #fff;
  font-weight: regular;
  background-color: transparent;
  padding: 10px 15px;
  margin: 20px 0;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  box-sizing: border-box;
  &:hover {
    cursor: pointer;
    font-weight: bold;
  }
`;

export default function ListItem(props) {
  const { children, onClick } = props;

  return <StyledListItem onClick={onClick}>{children}</StyledListItem>;
}

ListItem.propTypes = {
  children: PropTypes.string,
  onClick: PropTypes.func,
};

ListItem.defaultProps = {
  children: '',
  onClick: () => {},
};
