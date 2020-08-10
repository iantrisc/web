import React, { useContext, useEffect } from 'react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';

import { UserContext } from '../context/User';
import Section from '../pages/dashboard/Section';

export default function SectionNavigation() {
  const user = useContext(UserContext);
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    if (user.data.type === 'notLogged') history.push('/login');
  }, [user, history]);

  return (
    <Switch>
      <Route exact path={`${match.path}`}>
        <Section />
      </Route>
    </Switch>
  );
}
