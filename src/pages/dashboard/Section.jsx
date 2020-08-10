import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';

import API from '../../constants/Api';
import { UserContext } from '../../context/User';
import { useGraphQL } from '../../hooks/Fetch';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Button from '../../components/Button';
import Error from '../../components/Error';
import Success from '../../components/Success';

const StyledSection = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  width: 60%;
  padding: 30px 0;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
`;

const Form = styled.form`
  position: relative;
  display: grid;
  grid-template-rows: 1fr;
  padding: 20px 0;
  text-align: center;
`;

export default function Section() {
  const location = useLocation();
  const params = useParams();
  const [id, setId] = useState(
    location.state.id !== undefined ? location.state.id : params.id
  );
  const user = useContext(UserContext);
  const [title, setTitle] = useState('Section Title');
  const [text, setText] = useState('Section content');
  const [pageId, setPageId] = useState(location.state.page.id);
  const [pagePath, setPagePath] = useState(location.state.page.path);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const data = useGraphQL('sections', {
    type: 'section',
    params: `id: "${id}"`,
    body: ['pageId', 'pagePath', 'title', 'text'],
  });

  const sendData = async () => {
    try {
      let endpoint = `${API}/pages/${pageId}/sections/insert`;

      if (id !== undefined) endpoint = `${API}/sections/${id}`;

      const response = await fetch(endpoint, {
        method: id !== undefined ? 'PUT' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ pageId, pagePath, title, text }),
      });

      if (response.ok && response.status === 200) {
        const json = await response.json();

        // oly set the id if a new section is been created.
        if (id === undefined) setId(json._id);

        setSuccess('Changes saved');
      } else {
        setError(
          'We encountered an error connecting to the server. Try again later.'
        );
      }
    } catch (err) {
      setError(
        'We encountered an error connecting to the server. Try again later.'
      );
    }
  };

  const submit = (event) => {
    event.preventDefault();
    setSuccess(false);
    sendData();
  };

  useEffect(() => {
    if (data) {
      if ('err' in data) {
        setError(
          'We encountered an error loading the section data. Reload the page.'
        );
      } else {
        setTitle(data.title);
        setText(data.text);
        setPageId(data.pageId);
        setPagePath(data.pagePath);
      }
    }
  }, [data]);

  return (
    <StyledSection>
      <div>
        <p>You are logged as: {user.data.name}</p>
        <h1>{id !== undefined ? 'Section' : 'New Section'}</h1>
      </div>
      <Form onSubmit={submit}>
        <Input
          type="text"
          value={title}
          label="Title"
          errorMsg="You must provide a title"
          onChange={(value) => setTitle(value)}
        />
        <Textarea
          type="text"
          value={text}
          label="Content"
          onChange={(value) => setText(value)}
        />
        <Button type="submit">Submit</Button>
        {error ? <Error>{error}</Error> : <div />}
        {success ? <Success>{success}</Success> : <div />}
      </Form>
    </StyledSection>
  );
}
