/* global $ Materialize */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';
import * as UserActions from '../../actions/UserActions';

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
      searching: false
    };

    this.renderedDocuments = this.renderedDocuments.bind(this);
    this.combinedRendered = this.combinedRendered.bind(this);
    this.renderedUsers = this.renderedUsers.bind(this);
    this.search = this.search.bind(this);
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
    const { documents, users, fetchingDocuments, fetchingUsers } = nextProps;
    this.setState({
      documents,
      users,
      fetchingDocuments,
      fetchingUsers
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
    const limit = $('#limit').val();
    const offset = $('#offset').val();
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
   * Formats document for rendering
   * @returns {element} DOM element
   * @memberOf SearchPage
   */
  renderedDocuments() {
    if (this.state.fetchingDocuments && this.state.searching) {
      const documents = this.state.documents;
      const render = documents.map((document) => {
        const { id, title, content, createdAt, updatedAt } = document;
        const parsedContent =
          <span dangerouslySetInnerHTML={{ __html: content }} />;
        return (
          <li key={id}>
            <div className="collapsible-header">
              <i className="material-icons orange">library_books</i>
              <span><b>Title: </b> <em>{title} </em> ||</span>
              <span> <b>Created:</b> <em>{createdAt}</em> ||</span>
              <span> <b>Modified:</b> <em>{updatedAt}</em> </span>
            </div>
            <div className="collapsible-body">{parsedContent}</div>
          </li>);
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
      const render = users.map((user) => {
        const { firstName, lastName, email, id } = user;
        return (
          <li key={id}>
            <div className="collapsible-header">
              <i className="material-icons orange">person</i>
              <span><b>First Name: </b>
                <em>{firstName}</em></span>
            </div>
            <div className="collapsible-body">
              <span> <b>FirstName:</b> {firstName} </span><br />
              <span> <b>LastName:</b> {lastName} </span><br />
              <span> <b>Email:</b> {email} </span><br />
            </div>
          </li>);
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
      <div className="container">
        <div className="my-centered white">
          <div className="white" >
            <div className="row">
              <h5 className="col s6 m2"> Search for: </h5>
              <select
                id="searchSelect"
                defaultValue="document"
                className="col s4 m3"
                onChange={this.changeSearch}
              >
                <option value="documents">Document</option>
                <option value="users">User</option>
              </select>
            </div>
            <div className="row my-top-border">
              <div className="input-field col m6 s4">
                <input id="search" type="text" className="validate" />
                <label htmlFor="search">Search</label>
              </div>
              <div className="input-field col m3 s4">
                <input id="limit" type="number" className="validate" />
                <label htmlFor="limit"> Search limit </label>
              </div>
              <div className="input-field col m3 s4">
                <input id="offset" type="number" className="validate" />
                <label htmlFor="offset"> Search offset </label>
              </div>
            </div>
          </div>
          <div className="row">
            <button
              id="searchButton"
              className="btn orange col m2 s12"
              onClick={this.search}
            >
            Search </button>
          </div>
          <div className=" scroll-a row col s12">
            <ul className="collapsible" data-collapsible="accordion">
              {this.combinedRendered()}
            </ul>
          </div>
        </div>
      </div>
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
  users: PropTypes.array
};

const mapStateToProps = state => ({
  documents: state.documentReducer.documents,
  users: state.userReducers.users,
  fetchingDocuments: state.documentReducer.fetchingDocuments,
  fetchingUsers: state.userReducers.fetchingUsers
});

const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch),
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
