import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SideNav from '../user/SideNav';
import DocumentEditForm from '../document/DocumentEditForm';

const UserPage = () =>
  (
    <div>
      <Route path="/dashboard" component={SideNav} />
      <Route exact path="/dashboard/:new-document" component={DocumentEditForm} />
    </div>
  );

export default UserPage;
