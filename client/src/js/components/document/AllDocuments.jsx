/* global $ */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';

/**
 * @class UserDocuments
 * @extends {React.Component}
 */
class AllDocuments extends React.Component {

  /**
   * Creates an instance of UserDocuments.
   * @param {object} props
   * @param {object} context
   * @returns {void}
   * @memberOf UserDocuments
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      documents: this.props.documents
    };

    this.renderedDocuments = this.renderedDocuments.bind(this);
    this.editDocument = this.editDocument.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
  }

  /**
   * @memberOf UserDocuments
   * @returns {void}
   */
  componentDidMount() {
    this.props.DocumentActions.getAllDocuments();
  }

  /**
   * @param {object} nextProps
   * @returns {void}
   * @memberOf UserDocuments
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.documents.length > 0) {
      this.setState({
        documents: nextProps.documents,
        fetchingDocuments: nextProps.fetchingDocuments,
        count: nextProps.count
      });
    }
  }

  /**
   * @return {void} Returns void
   * @memberOf AllDocuments
   */
  componentDidUpdate() {
    $('.collapsible').collapsible();
    this.props = this.props;
  }

  /**
   * @desc Redirects to edit page using document id
   * @param {object} e
   * @memberOf DocumentView
   * @returns {void}
   */
  editDocument(e) {
    e.preventDefault();
    const id = e.target.getAttribute('name');
    this.props.history.push(`/dashboard/edit-document/${id}`);
  }

  /**
   * @desc Delets a docuement and redirects to documents page
   * @param {object} e
   * @memberOf DocumentView
   * @returns {void}
   */
  deleteDocument(e) {
    e.preventDefault();
    const id = e.target.getAttribute('name');
    this.props.DocumentActions.deleteDocument(id);
  }

  /**
   * Formats document for rendering
   * @returns {element} DOM element
   * @memberOf SearchPage
   */
  renderedDocuments() {
    if (this.state.fetchingDocuments) {
      const documents = this.state.documents;
      const render = documents.map((document) => {
        const { id, title, content, createdAt, updatedAt, ownerId } = document;
        const parsedContent =
          <span dangerouslySetInnerHTML={{ __html: content }} />;
        const { userId, roleId } =
        JSON.parse(localStorage.getItem('user_profile'));
        return (
          <li key={id}>
            <div className="collapsible-header">
              <i className="material-icons orange">library_books</i>
              <span><b>Title: </b> <em>{title} </em> ||</span>
              <span> <b>Created:</b> <em>{createdAt}</em> ||</span>
              <span> <b>Modified:</b> <em>{updatedAt}</em> </span>
              { userId === ownerId || roleId === 1 ?
                <span className="right">
                  <a
                    className="my-zindex-high"
                    onClick={this.editDocument}
                    name={id}
                  >
                    <i
                      className="material-icons"
                      name={id}
                    >mode_edit</i></a>
                  <a
                    className=" my-danger lighten-2 my-zindex-high"
                    onClick={this.deleteDocument}
                    name={id}
                  >
                    <i
                      className="material-icons"
                      name={id}
                    >delete</i></a>
                </span> : ''}
            </div>
            <div className="collapsible-body white">{parsedContent}</div>
          </li>);
      });
      return render;
    }
  }

  /**
   * @returns {element} DOM element div
   * @memberOf UserDocuments
   */
  render() {
    const documents = this.state.documents;

    return (
      <div className="container width-85">
        <div className="row">
          <div className="col s12 m10 offset-m1">
            <p className="col s12 center-align white"> <strong>
            All Documents</strong> </p>
            { documents.length > 0 ?
              <div className=" scroll-a row col s12">
                <ul className="collapsible" data-collapsible="accordion">
                  {this.renderedDocuments()}
                </ul>
              </div>
                :
              <div className="row">
                <div className="col offset-m3 s12 m6">
                  <p className="white center-align">
                    Your Book Shelf is EMPTY, Go to
                    Dashboard and Create One Now!</p>
                  <img
                    className="empty"
                    src="/public/img/empty.jpg"
                    alt="No Document found"
                  />
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

AllDocuments.propTypes = {
  documents: PropTypes.array.isRequired,
  DocumentActions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchingDocuments: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  documents: state.documentReducer.documents,
  fetchingDocuments: state.documentReducer.fetchingDocuments,
  deletingDocument: state.documentReducer.deletingDocument,
  count: state.documentReducer.count
});

const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AllDocuments);
