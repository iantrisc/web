import React, { useContext, useEffect } from 'react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';

import { UserContext } from '../context/User';
import Page from '../pages/dashboard/Page';
import Section from './Section';

export default function PageNavigation() {
  const user = useContext(UserContext);
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    if (user.data.type === 'notLogged') history.push('/login');
  }, [user, history]);

  return (
    <Switch>
      <Route exact path={`${match.path}`}>
        <Page />
      </Route>
      <Route path={`${match.path}/section`}>
        <Section />
      </Route>
    </Switch>
  );
}
