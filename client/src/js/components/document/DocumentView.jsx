import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';
import PlainDocumentView from './PlainDocumentView';

/**
 * @class DocumentView
 * @extends {React.Component}
 */
class DocumentView extends React.Component {

  /**
   * Creates an instance of DocumentView.
   * @param {any} props
   * @param {any} context
   * @memberOf DocumentView
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      id: '',
      title: '',
      content: ''
    };

    this.deleteDocument = this.deleteDocument.bind(this);
    this.editDocument = this.editDocument.bind(this);
  }

  /**
   * @memberOf DocumentView
   * @returns {void}
   */
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.DocumentActions.getDocument(id);
  }

  /**
   * @param {objcet} nextProps
   * @memberOf DocumentView
   * @returns {void}
   */
  componentWillReceiveProps(nextProps) {
    const { title, id, content } = nextProps.documents;
    this.setState({
      title,
      id,
      content
    });
  }

  /**
   * @return {void} Returns void
   * @memberOf DocumentView
   */
  componentDidUpdate() {
    this.props = this.props;
  }

  /**
   * @desc Redirects to edit page using document id
   * @param {object} event - triggered event
   * @memberOf DocumentView
   * @returns {void}
   */
  editDocument(event) {
    event.preventDefault();
    const id = event.target.getAttribute('name');
    this.props.history.push(`/dashboard/edit-document/${id}`);
  }

  /**
   * @desc Deletes a docuement and redirects to documents page
   * @param {object} event - triggered event
   * @memberOf DocumentView
   * @returns {void}
   */
  deleteDocument(event) {
    event.preventDefault();
    const id = event.target.getAttribute('name');
    this.props.DocumentActions.deleteDocument(id)
      .then(() => {
        this.props.history.push('/dashboard/my-documents');
      });
  }

  /**
   * @returns {element} DOM element - div
   * @memberOf DocumentView
   */
  render() {
    const parsedContent = (<div
      dangerouslySetInnerHTML={{ __html: this.state.content }}
    />);
    return (
      <PlainDocumentView
        title={this.state.title}
        parsedContent={parsedContent}
        editDocument={this.editDocument}
        id={this.state.id}
        deleteDocument={this.deleteDocument}
      />
    );
  }
}

DocumentView.propTypes = {
  match: PropTypes.object.isRequired,
  DocumentActions: PropTypes.func.isRequired,
  documents: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  documents: state.documentReducer.documents
});

const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView);
