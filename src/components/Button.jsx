import styled from 'styled-components';

import Colors from '../constants/Colors';

const Button = styled.button`
  height: 40px;
  width: 100%;
  background-color: #fff;
  padding: 10px 15px;
  text-align: center;
  border: none;
  box-sizing: border-box;
  transition: color 0.3s, background-color 0.3s;
  &:hover {
    cursor: pointer;
    color: #fff;
    background-color: ${Colors.accent};
  }
`;

export default Button;
