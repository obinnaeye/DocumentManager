/* global $ Materialize */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';
import * as UserActions from '../../actions/UserActions';
import UserCollapsible from './UserCollapsible';
import DocumentCollapsible from '../document/DocumentCollapsible';
import PlainSearchPage from './PlainSearchPage';

/**
 * @class SearchPage
 * @extends {React.Component}
 */
class SearchPage extends React.Component {
  /**
   * Creates an instance of SearchPage.
   * @param {object} props
   * @param {object} context
   * @memberOf SearchPage
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      searchIn: '',
      searchQuery: '',
      documents: [],
      user: [],
      fetchingDocuments: false,
      fetchingUsers: false,
      searching: false,
      limit: 10,
      offset: 0
    };

    this.renderedDocuments = this.renderedDocuments.bind(this);
    this.combinedRendered = this.combinedRendered.bind(this);
    this.renderedUsers = this.renderedUsers.bind(this);
    this.search = this.search.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.viewDocument = this.viewDocument.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.editUser = this.editUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  /**
   * @memberOf SearchPage
   * @returns {void}
   */
  componentDidMount() {
    $('select').material_select();
    $('.collapsible').collapsible();
  }

  /**
   * @param {object} nextProps
   * @memberOf SearchPage
   * @returns {void}
   */
  componentWillReceiveProps(nextProps) {
    const { documents, users, fetchingDocuments,
      fetchingUsers, documentStateCount, deletingDocument, deletingUser,
      userStateCount }
    = nextProps;
    this.setState({
      documents,
      users,
      fetchingDocuments,
      fetchingUsers,
      documentStateCount,
      deletingDocument,
      deletingUser,
      userStateCount
    });
  }

  /**
   * Performs a search for user or document
   * @returns {void}
   * @memberOf SearchPage
   */
  search() {
    const search = $('#search').val();
    const searchIn = $('#searchSelect').val();
    const { offset, limit } = this.state;
    const searchData = {
      q: search,
      limit,
      offset
    };
    if (!search) {
      this.setState({
        searching: false
      });
      Materialize.toast('You have not entered any search word!', 3000, 'red');
      return;
    }
    if (searchIn === 'documents') {
      this.props.DocumentActions.searchDocuments(searchData);
      this.setState({
        searching: true,
        searchIn: 'documents'
      });
    } else {
      this.props.UserActions.searchUsers(searchData);
      this.setState({
        searching: true,
        searchIn: 'users'
      });
    }
  }

  /**
   * Returns render for user or document
   * @returns {element} DOM element
   * @memberOf SearchPage
   */
  combinedRendered() {
    if (this.state.searchIn === 'documents') {
      return this.renderedDocuments();
    }
    return this.renderedUsers();
  }

  /**
   * @desc - Method that handles change events
   * @param {objcet} event - triggered event
   * @return {void} - Returns void
   * @memberOf SearchPage
   */
  inputChange(event) {
    event.preventDefault();
    const value = event.target.value;
    const name = event.target.getAttribute('id');
    if (value < 0) {
      Materialize.toast(`${name} can not be negative`, 3000, 'red');
      return;
    }
    this.setState({
      [name]: value
    },
    this.search);
  }

  /**
   * @desc Deletes a docuement
   * @param {object} event - triggered event
   * @memberOf SearchPage
   * @returns {void}
   */
  deleteDocument(event) {
    event.preventDefault();
    const id = event.target.getAttribute('name');
    this.props.DocumentActions.deleteDocument(id);
  }

  /**
   * @desc Redirects to view page using document id
   * @param {object} event - triggered event
   * @memberOf SearchPage
   * @returns {void}
   */
  viewDocument(event) {
    event.preventDefault();
    const id = event.target.getAttribute('name');
    this.props.history.push(`/dashboard/documents/${id}`);
  }

  /**
   * @desc Redirects to edit page using user id
   * @param {object} event - triggered event
   * @memberOf SearchPage
   * @returns {void}
   */
  editUser(event) {
    event.preventDefault();
    const id = event.target.getAttribute('name');
    this.props.history.push(`/dashboard/edit-user/${id}`);
  }

  /**
   * @desc Delets a user
   * @param {object} event - triggered event
   * @memberOf SearchPage
   * @returns {void}
   */
  deleteUser(event) {
    event.preventDefault();
    const id = event.target.getAttribute('name');
    this.props.UserActions.deleteUser(id);
  }

  /**
   * Formats document for rendering
   * @returns {element} DOM element
   * @memberOf SearchPage
   */
  renderedDocuments() {
    if (this.state.fetchingDocuments && this.state.searching
      && this.state.documents.length > 0) {
      const documents = this.state.documents;
      const render = documents.map((document) => {
        const { id, title, content, createdAt, updatedAt, ownerId } = document;
        const { userId, roleId } =
        JSON.parse(localStorage.getItem('user_profile'));
        const parsedContent =
          <span dangerouslySetInnerHTML={{ __html: content }} />;
        return (
          <DocumentCollapsible
            key={id}
            id={id}
            title={title}
            createdAt={createdAt}
            updatedAt={updatedAt}
            ownerId={ownerId}
            userId={userId}
            roleId={roleId}
            parsedContent={parsedContent}
            viewDocument={this.viewDocument}
            deleteDocument={this.deleteDocument}
          />
        );
      });
      return render;
    }
    if (this.state.searching) {
      return <p> No Document found matching your search!</p>;
    }
  }

  /**
   * Formats user for rendering
   * @returns {element} DOM element
   * @memberOf SearchPage
   */
  renderedUsers() {
    if (this.state.fetchingUsers && this.state.searching) {
      const users = this.state.users;
      const { roleId } =
        JSON.parse(localStorage.getItem('user_profile'));
      const render = users.map((user) => {
        const { firstName, lastName, userId } = user;
        return (
          <UserCollapsible
            key={userId}
            roleId={roleId}
            firstName={firstName}
            lastName={lastName}
            role={user.roleId === 1 ? 'Admin' : 'Regular'}
            userId={userId}
            editUser={this.editUser}
            deleteUser={this.deleteUser}
          />
        );
      });
      return render;
    }
    if (this.state.searching) {
      return <p className="centered"> No User found matching your search!</p>;
    }
  }

  /**
   * @returns {element} DOM element - div
   * @memberOf SearchPage
   */
  render() {
    return (
      <PlainSearchPage
        limit={this.state.limit}
        offset={this.state.offset}
        search={this.search}
        inputChange={this.inputChange}
        combinedRendered={this.combinedRendered}
      />
    );
  }
}

SearchPage.defaultProps = {
  documents: [],
  users: [],
  fetchingDocuments: false,
  fetchingUsers: false
};

SearchPage.propTypes = {
  documents: PropTypes.array,
  fetchingDocuments: PropTypes.bool,
  DocumentActions: PropTypes.object.isRequired,
  fetchingUsers: PropTypes.bool,
  UserActions: PropTypes.object.isRequired,
  users: PropTypes.array,
  documentStateCount: PropTypes.number.isRequired,
  userStateCount: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  deletingUser: PropTypes.bool.isRequired,
  deletingDocument: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  documents: state.documentReducer.documents,
  users: state.userReducers.users,
  fetchingDocuments: state.documentReducer.fetchingDocuments,
  fetchingUsers: state.userReducers.fetchingUsers,
  deletingDocument: state.documentReducer.deletingDocument,
  deletingUser: state.userReducers.deletingUser,
  documentStateCount: state.documentReducer.count,
  userStateCount: state.userReducers.count
});

const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch),
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
