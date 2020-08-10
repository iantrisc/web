import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { UserContext } from '../../context/User';
import { useGraphQL } from '../../hooks/Fetch';
import List from '../../components/List';
import ListItem from '../../components/ListItem';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

const StyledPages = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
`;

export default function Pages() {
  const user = useContext(UserContext);
  const history = useHistory();
  const [items, setItems] = useState(false);
  const data = useGraphQL('pages', { type: 'pages', body: ['_id', 'title'] });

  useEffect(() => {
    if (data) {
      if ('err' in data) {
        setItems(<div>We are encountered an error. Reload the page.</div>);
      } else if (data.length) {
        setItems(
          data.map((page) => (
            <ListItem
              key={page._id}
              onClick={() => {
                history.push({
                  pathname: '/dashboard/page',
                  state: { id: page._id },
                });
              }}>
              {page.title}
            </ListItem>
          ))
        );
      } else {
        setItems(<div>There are no pages yet</div>);
      }
    }
  }, [data, history]);

  return (
    <StyledPages>
      <div>
        <p>You are logged as: {user.data.name}</p>
        <h1>Pages</h1>
      </div>
      {items ? <List>{items}</List> : <Loading />}
      <Button
        onClick={() => {
          history.push({
            pathname: '/dashboard/page',
            state: {},
          });
        }}>
        Add new page
      </Button>
    </StyledPages>
  );
}
