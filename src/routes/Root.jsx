import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from '../pages/Login';
import Page from '../pages/Page';
import Admin from '../pages/Admin';

export default function Root() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/" exact>
            <Page path="/" />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/dashboard">
            <Admin />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}
