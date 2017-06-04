import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import routes from './routes';

const app = document.getElementById('app');

ReactDom.render(
  <Router>
    <Switch>
      {routes}
    </Switch>
  </Router>
  ,
app);
