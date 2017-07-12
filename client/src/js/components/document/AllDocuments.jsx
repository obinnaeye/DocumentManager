/* global $ Materialize */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';
import DocumentCollapsible from './DocumentCollapsible';
import PlainAllDocuments from './PlainAllDocuments';

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
   * @memberOf AllDocuments
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      documents: this.props.documents,
      offset: 0,
      limit: 10
    };

    this.renderedDocuments = this.renderedDocuments.bind(this);
    this.viewDocument = this.viewDocument.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.getDocuments = this.getDocuments.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }

  /**
   * @memberOf AllDocuments
   * @returns {void}
   */
  componentDidMount() {
    this.getDocuments();
  }

  /**
   * @param {object} nextProps
   * @returns {void}
   * @memberOf AllDocuments
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
   * @desc - Method that gets all document instances
   * @return {void} - Returns void
   * @memberOf AllDocuments
   */
  getDocuments() {
    const { offset, limit } = this.state;
    this.props.DocumentActions.getAllDocuments(offset, limit);
  }

  /**
   * @desc - Method that handles change events
   * @param {objcet} event - triggered event
   * @return {void} - Returns void
   * @memberOf AllDocuments
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
    }, this.getDocuments);
  }

  /**
   * @desc Redirects to view page using document id
   * @param {object} event - triggered event
   * @memberOf AllDocuments
   * @returns {void}
   */
  viewDocument(event) {
    event.preventDefault();
    const id = event.target.getAttribute('name');
    this.props.history.push(`/dashboard/documents/${id}`);
  }

  /**
   * @desc Deletes a docuement
   * @param {object} event - triggered event
   * @memberOf AllDocuments
   * @returns {void}
   */
  deleteDocument(event) {
    event.preventDefault();
    const id = event.target.getAttribute('name');
    this.props.DocumentActions.deleteDocument(id);
  }

  /**
   * Formats document for rendering
   * @returns {element} DOM element
   * @memberOf AllDocuments
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
          />);
      });
      return render;
    }
  }

  /**
   * @returns {element} DOM element div
   * @memberOf AllDocuments
   */
  render() {
    const documents = this.state.documents;

    return (
      <PlainAllDocuments
        limit={this.state.limit}
        offset={this.state.offset}
        inputChange={this.inputChange}
        documents={documents}
        renderedDocuments={this.renderedDocuments}
      />
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
