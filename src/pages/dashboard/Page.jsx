import React, { useContext, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import API from '../../constants/Api';
import { UserContext } from '../../context/User';
import { useGraphQL } from '../../hooks/Fetch';
import List from '../../components/List';
import ListItem from '../../components/ListItem';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Error from '../../components/Error';
import Success from '../../components/Success';
import Loading from '../../components/Loading';

const StyledPage = styled.div`
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

export default function Page() {
  const location = useLocation();
  const [id, setId] = useState(location.state.id);
  const user = useContext(UserContext);
  const history = useHistory();
  const [path, setPath] = useState('/');
  const [title, setTitle] = useState('Page Title');
  const [subtitle, setSubtitle] = useState('');
  const [items, setItems] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const data = useGraphQL('pages', {
    type: 'page',
    params: `id: "${id}"`,
    body: ['path', 'title', 'subtitle'],
  });
  const sections = useGraphQL('sections', {
    type: 'sections',
    params: `pageId: "${id}"`,
    body: ['_id', 'title'],
  });

  const sendData = async () => {
    try {
      let endpoint = `${API}/pages/insert`;

      if (id !== undefined) endpoint = `${API}/pages/${id}`;

      const response = await fetch(endpoint, {
        method: id !== undefined ? 'PUT' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ path, title, subtitle }),
      });

      if (response.ok && response.status === 200) {
        const json = await response.json();

        // oly set the id if a new page is been created.
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

    if (path !== '' && title !== '') sendData();
    else setError('You must provide a path and a title.');
  };

  useEffect(() => {
    if (data) {
      if ('err' in data) {
        setError(
          'We encountered an error loading the page data. Reload the page.'
        );
      } else {
        setPath(data.path);
        setTitle(data.title);
        setSubtitle(data.subtitle);
      }
    }
  }, [data]);

  useEffect(() => {
    if (sections) {
      if ('err' in sections) {
        setItems(<div>We encountered an error. Reload the page.</div>);
      } else if (sections.length) {
        setItems(
          sections.map((section) => (
            <ListItem
              key={section._id}
              onClick={() => {
                history.push({
                  pathname: '/dashboard/page/section',
                  state: { id: section._id, page: { id, path } },
                });
              }}>
              {section.title}
            </ListItem>
          ))
        );
      } else {
        setItems(<div>There are no sections on this page</div>);
      }
    }
  }, [sections, history, id, path]);

  return (
    <StyledPage>
      <div>
        <p>You are logged as: {user.data.name}</p>
        <h1>{id !== undefined ? 'Page' : 'New Page'}</h1>
      </div>
      <Form onSubmit={submit}>
        <Input
          type="text"
          value={path}
          label="Path for the browser url bar"
          errorMsg="You must provide a path"
          onChange={(value) => setPath(value)}
          onBlur={() => setError(false)}
          isRequired
        />
        <Input
          type="text"
          value={title}
          label="Title"
          errorMsg="You must provide a title"
          onChange={(value) => setTitle(value)}
          onBlur={() => setError(false)}
          isRequired
        />
        <Input
          type="text"
          value={subtitle}
          label="Subtitle"
          onChange={(value) => setSubtitle(value)}
        />
        <Button type="submit">Submit</Button>
        {error ? <Error>{error}</Error> : <div />}
        {success ? <Success>{success}</Success> : <div />}
      </Form>
      {items ? <List>{items}</List> : <Loading />}
      <Button
        onClick={() => {
          history.push({
            pathname: '/dashboard/page/section',
            state: { page: { id, path } },
          });
        }}>
        Add new section
      </Button>
    </StyledPage>
  );
}
