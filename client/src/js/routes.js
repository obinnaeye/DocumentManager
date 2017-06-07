import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import App from './app';
// import Dashboard from './components/home/DashBoard';
import NavBar from './components/common/NavBar';
import Signup from './components/authentication/Signup';


export default (
  <Router>
    <Switch>
      <div>
        <NavBar />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={App} />
      </div>
    </Switch>
  </Router>
);
