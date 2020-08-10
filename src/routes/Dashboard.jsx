import React, { useContext, useEffect } from 'react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';

import { UserContext } from '../context/User';
import Pages from '../pages/dashboard/Pages';
import Page from './Page';

export default function Dashboard() {
  const user = useContext(UserContext);
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    if (user.data.type === 'notLogged') history.push('/login');
  }, [user, history]);

  return (
    <Switch>
      <Route exact path={`${match.path}`}>
        <Pages />
      </Route>
      <Route path={`${match.path}/pages`}>
        <Pages />
      </Route>
      <Route path={`${match.path}/page`}>
        <Page />
      </Route>
    </Switch>
  );
}
