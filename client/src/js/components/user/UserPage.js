import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SideNav from '../user/SideNav';
import DocumentEditForm from '../document/DocumentEditForm';
import UserDocuments from '../document/UserDocuments';

const UserPage = () =>
  (
    <div>
      <Route path="/dashboard" component={SideNav} />
      <Route exact path="/dashboard/:new-document" component={DocumentEditForm} />
      <Route exact path="/dashboard/my-documents" component={UserDocuments} />
    </div>
  );

export default UserPage;
