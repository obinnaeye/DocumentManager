import React from 'react';
import { Route } from 'react-router-dom';
import App from './app';
import Dashboard from './components/home/DashBoard';
import NavBar from './components/common/NavBar';


export default (
  <div>
    <NavBar />
    <Route exact path="/login" component={App} />
    <Route path="/dashboard" component={Dashboard} />
  </div>
);
