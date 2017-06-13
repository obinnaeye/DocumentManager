import React from 'react';
import { Route } from 'react-router-dom';
import SideNav from '../user/SideNav';
import NewDocument from '../document/NewDocument';
import UserDocuments from '../document/UserDocuments';
import DocumentView from '../document/DocumentView'; // remove
import EditDocument from '../document/EditDocument';

const UserPage = () =>
  (
    <div>
      <Route path="/dashboard" component={SideNav} />
      <Route exact path="/dashboard/:new-document" component={NewDocument} />
      <Route exact path="/dashboard/my-documents" component={UserDocuments} />
      <Route exact path="/dashboard/documents/:id" component={DocumentView} />
      <Route exact path="/dashboard/edit-document/:id" component={EditDocument} />
    </div>
  );

export default UserPage;
