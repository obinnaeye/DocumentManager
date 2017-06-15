import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import Signin from '../js/components/authentication/Signin';
// import Dashboard from './components/home/DashBoard';
import NavBar from './components/common/NavBar';
import Signup from './components/authentication/Signup';
import UserPage from '../js/components/user/UserPage';


export default (
  <Router >
    <Switch>
      <div>
        <NavBar />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
        <UserPage />
      </div>
    </Switch>
  </Router>
);
