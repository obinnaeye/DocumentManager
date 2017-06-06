import React from 'react';
import { Route } from 'react-router-dom';
import App from './app';
// import Dashboard from './components/home/DashBoard';
import NavBar from './components/common/NavBar';
import Signup from './components/authentication/Signup';


export default (
  <div>
    <NavBar />
    <Route exact path="/signup" component={Signup} />
    <Route exact path="/login" component={App} />
  </div>
);
