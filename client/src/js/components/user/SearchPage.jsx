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
      fetchingDocument: false,
      fetchingUser: false,
      searching: false
    };

    this.renderedDocument = this.renderedDocument.bind(this);
    this.searchDocument = this.searchDocument.bind(this);
  }

  componentDidMount() {
    $('select').material_select();
  }

  componentWillReceiveProps(nextProps) {
    console.log('red', nextProps.documents)
    this.setState({
      documents: nextProps.documents,
      fetchingDocument: nextProps.fetchingDocument
    })
  }

  renderedDocument() {
    if (this.state.fetchingDocument && this.state.searching) {
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

  searchDocument() {
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
        searching: true
      });
    }
  }

  render() {
    return (
      <div className="container">
        <div className="my-centered" >
          <div className="row">
            <h5 className="col s2"> Search for: </h5>
            <select id="searchSelect" defaultValue="document" className="col s3">
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
          <button id="searchButton" className="btn" onClick={this.searchDocument}> Search </button>
        </div>
        <div className=" row my-centered col s12">
          <ul className="collapsible" data-collapsible="accordion">
            {this.renderedDocument()}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  documents: state.documentReducer.documents,
  fetchingDocument: state.documentReducer.fetchingDocument,
  fetchingUser: state.signUpReducer.fetchingUser
});

const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
