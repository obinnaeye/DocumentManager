/* global $ Materialize */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';
import DocumentCollapsible from './DocumentCollapsible';
import PlainAllDocuments from './PlainAllDocuments';

/**
 * @class AllDocuments
 * @extends {React.Component}
 */
export class AllDocuments extends React.Component {

  /**
   * Creates an instance of AllDocuments.
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
      limit: 10,
      start: 0,
      fetchingDocuments: this.props.fetchingDocuments
    };

    this.renderedDocuments = this.renderedDocuments.bind(this);
    this.viewDocument = this.viewDocument.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.getDocuments = this.getDocuments.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.pageNavigation = this.pageNavigation.bind(this);
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
      const allDocuments = nextProps.documents;
      const totalDocuments = allDocuments.length;
      const pagecount = Math.ceil(totalDocuments / 10);
      let { start } = this.state;
      let target;
      let documents = allDocuments.slice(start, start + 10);
      let length;
      if (this.state.target) {
        this.state.target.classList.remove('active');
      }
      if (start > 0 && totalDocuments <= start) {
        start = ((start / 10) - 1) * 10;
        documents = allDocuments.slice(start, start + 10);
        const parent = document.getElementsByClassName('pagination');
        length = parent[0].children.length;
        target = parent[0].children[length - 3];
        if (length === 3) {
          target = parent[0].children[length - 2];
        }
      }
      this.setState({
        allDocuments,
        fetchingDocuments: nextProps.fetchingDocuments,
        count: nextProps.count,
        documents,
        pagecount,
        target
      }, () => {
        if (target && length >= 4) {
          target.classList.add('active');
          target.click();
        }
      });
    }
  }

  /**
   * @return {void} Returns void
   * @memberOf AllDocuments
   */
  componentDidUpdate() {
    const testing = process.env.NODE_ENV === 'test';
    if (!testing) {
      $('.collapsible').collapsible();
      this.props = this.props;
    }
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
    if (value < 1 && name === 'limit') {
      Materialize.toast(`${name} can not be 0`, 3000, 'red');
    } else if (value < 0 && name === 'offset') {
      Materialize.toast(`${name} can not be negative`, 3000, 'red');
    } else {
      this.setState({
        [name]: value
      }, this.getDocuments);
    }
  }


  /**
   * @desc Navigates to next/previous document list
   * @returns {void} - returns void
   * @param {object} event - target DOM element
   * @memberOf AllDocuments
   */
  pageNavigation(event) {
    const selected = event.selected;
    const start = selected * 10;
    const documents = this.state.allDocuments.slice(start, start + 10);
    this.setState({ documents, start, selected });
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
      <div>
        <PlainAllDocuments
          limit={this.state.limit}
          offset={this.state.offset}
          inputChange={this.inputChange}
          documents={documents}
          renderedDocuments={this.renderedDocuments}
          pageNavigation={this.pageNavigation}
          pagecount={this.state.pagecount}
          initialPage={this.state.initialPage}
          forcePage={this.state.forcePage}
        />
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

const mapStateToProps = ({ documentReducer }) => ({
  documents: documentReducer.documents,
  fetchingDocuments: documentReducer.fetchingDocuments,
  deletingDocument: documentReducer.deletingDocument,
  count: documentReducer.count
});

const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AllDocuments);
