// eslint-disable-next-line import/extensions
import 'regenerator-runtime/runtime.js';

import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import API from '../constants/Api';
import { UserContext } from '../context/User';
import Input from '../components/Input';
import Button from '../components/Button';
import Error from '../components/Error';

const StyledLogin = styled.div`
  width: 60%;
  margin-left: auto;
  margin-right: auto;
`;

const Form = styled.form`
  position: relative;
  display: grid;
  grid-template-rows: 1fr;
  padding: 50px 0;
  text-align: center;
`;

export default function Login() {
  const user = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const sendCredentials = async () => {
    try {
      const response = await fetch(`${API}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok && response.status === 200) {
        const json = await response.json();

        user.setData(json);
        history.push('/dashboard');
      } else {
        setError('Your email or password are not valid.');
      }
    } catch (err) {
      setError(
        'There was a trouble connecting to the server. Try again later.'
      );
    }
  };

  const submit = (event) => {
    event.preventDefault();

    if (email !== '' && password !== '') sendCredentials();
    else setError('You must provide an email and password.');
  };

  return (
    <StyledLogin>
      <Form onSubmit={submit}>
        <Input
          type="text"
          value={email}
          label="Email"
          errorMsg="You must provide an email"
          onChange={(value) => setEmail(value)}
          onBlur={() => setError(false)}
          isRequired
        />
        <Input
          type="password"
          value={password}
          label="Password"
          errorMsg="You must provide a password"
          onChange={(value) => setPassword(value)}
          onBlur={() => setError(false)}
          isRequired
        />
        <Button type="submit">Submit</Button>
        {error ? <Error>{error}</Error> : <div />}
      </Form>
    </StyledLogin>
  );
}
