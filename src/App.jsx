import React, { useState } from 'react';
import { createGlobalStyle } from 'styled-components';

import { UserContext } from './context/User';
import Root from './routes/Root';

const GlobalStyle = createGlobalStyle`
  html {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
  body {
    position: absolute;
    width: 100%;
    height: 100%;
    font-family: 'Poppins', sans-serif;
    background-color: #000;
    color: #fff;
    font-size: 16px;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ data: user, setData: setUser }}>
      <GlobalStyle />
      <Root />
    </UserContext.Provider>
  );
}
