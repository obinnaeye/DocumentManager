import React from 'react';
import { Route } from 'react-router-dom';
import SideNav from '../user/SideNav';
import NewDocument from '../document/NewDocument';
import UserDocuments from '../document/UserDocuments';
import DocumentView from '../document/DocumentView'; // remove
import EditDocument from '../document/EditDocument';
import SearchPage from './SearchPage';
import EditProfile from './EditProfile';
import PageAccessHelper from '../../helper/PageAccessHelper';

const UserPage = () =>
  (
    <div>
      <Route path="/dashboard" component={PageAccessHelper(SideNav)} />
      <Route exact path="/dashboard/:new-document" component={PageAccessHelper(NewDocument)} />
      <Route exact path="/dashboard/my-documents" component={PageAccessHelper(UserDocuments)} />
      <Route exact path="/dashboard/documents/:id" component={PageAccessHelper(DocumentView)} />
      <Route exact path="/dashboard/edit-document/:id" component={PageAccessHelper(EditDocument)} />
      <Route exact path="/dashboard/search" component={PageAccessHelper(SearchPage)} />
      <Route exact path="/dashboard/edit-profile" component={PageAccessHelper(EditProfile)} />
    </div>
  );

export default UserPage;
