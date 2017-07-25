import { HashRouter as Router, Route, Switch }
  from 'react-router-dom';
import React from 'react';
import Signin from '../js/components/authentication/Signin';
import NavBar from './components/common/NavBar';
import Signup from './components/authentication/Signup';
import UserPage from '../js/components/user/UserPage';

// user PageAccessHelper here on UserPage and remove from other components
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
