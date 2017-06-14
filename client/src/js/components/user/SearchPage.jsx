import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';
import * as UserActions from '../../actions/UserActions';

class SearchPage extends React.Component {
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

  componentDidMount() {
    $('select').material_select();
  }

  componentWillReceiveProps(nextProps) {
    const { documents, users, fetchingDocuments, fetchingUsers } = nextProps;
    this.setState({
      documents,
      users,
      fetchingDocuments,
      fetchingUsers
    });
  }

  renderedDocuments() {
    if (this.state.fetchingDocuments && this.state.searching) {
      const documents = this.state.documents;
      const render = documents.map((document) => {
        const { id, title, content, createdAt, updatedAt } = document;
        const parsedContent = <span dangerouslySetInnerHTML={{ __html: content }} />;
        return (
          <li key={id}>
            <div className="collapsible-header">
              <i className="material-icons">filter_drama</i>
              <b className="red">{title}</b>
              <span> <b>Created:</b> {createdAt} </span>
              <span> <b>Modified:</b> {updatedAt} </span>
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

  combinedRendered() {
    if (this.state.searchIn === 'documents') {
      return this.renderedDocuments();
    }
    return this.renderedUsers();
  }

  renderedUsers() {
    if (this.state.fetchingUsers && this.state.searching) {
      const users = this.state.users;
      const render = users.map((user) => {
        const { firstName, lastName, email, id } = user;
        return (
          <li key={id}>
            <div className="collapsible-header">
              <i className="material-icons">filter_drama</i>
              <b className="red">{firstName}</b>
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
      return Materialize.toast('You have not entered any search word!', 3000, 'red')
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

  render() {
    return (
      <div className="container">
        <div className="my-centered" >
          <div className="row">
            <h5 className="col s2"> Search for: </h5>
            <select id="searchSelect" defaultValue="document" className="col s3" onChange={this.changeSearch}>
              <option value="documents">Document</option>
              <option value="users">User</option>
            </select>
          </div>
          <div className="row my-top-border">
            <div className="input-field col s6">
              <input id="search" type="text" className="validate" />
              <label htmlFor="search">Search</label>
            </div>
            <div className="input-field col s3">
              <input id="limit" type="number" className="validate" />
              <label htmlFor="limit"> Search limit </label>
            </div>
            <div className="input-field col s3">
              <input id="offset" type="number" className="validate" />
              <label htmlFor="offset"> Search offset </label>
            </div>
          </div>
        </div>
        <div className="row">
          <button id="searchButton" className="btn" onClick={this.search}> Search </button>
        </div>
        <div className=" row my-centered col s12">
          <ul className="collapsible" data-collapsible="accordion">
            {this.combinedRendered()}
          </ul>
        </div>
      </div>
    );
  }
}

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
