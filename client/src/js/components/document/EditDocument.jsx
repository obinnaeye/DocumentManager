/* global CKEDITOR $ Materialize */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';
import PlainEditDocument from './PlainEditDocument';

/**
 * @class EditDocument
 * @extends {React.Component}
 */
class EditDocument extends React.Component {

  /**
   * Creates an instance of EditDocument.
   * @param {object} props
   * @param {object} context
   * @memberOf EditDocument
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      editID: props.match.params.id,
      access: this.props.document.access,
      callcount: this.props.count,
      userProfile: JSON.parse(localStorage.user_profile),
      content: this.props.document.content,
      exiting: false
    };
    this.save = this.save.bind(this);
    this.saveExit = this.saveExit.bind(this);
    this.exit = this.exit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkProps = this.checkProps.bind(this);
  }

  /**
   * @memberOf EditDocument
   * @returns {void}
   */
  componentDidMount() {
    CKEDITOR.replace('editor', {
      uiColor: '#ffa726'
    });
    $('select').material_select();
    this.props.DocumentActions.getDocument(this.state.editID);
  }


  /**
   * @param {objcet} nextProps
   * @memberOf EditDocument
   * @returns {void}
   */
  componentWillReceiveProps(nextProps) {
    this.checkProps(nextProps);
  }

  /**
   * @memberOf EditDocument
   * @returns {void}
   */
  componentWillUnmount() {
    CKEDITOR.instances.editor.destroy();
    this.state = this.state;
  }
  /**
   * @desc Checks nextProps and redirects if no user-editable document
   * @param {objcet} nextProps
   * @returns {void}
   * @memberOf EditDocument
   */
  checkProps(nextProps) {
    const { editID } = this.state;
    // check if document has been fetched
    // first prop recieved may not have updated AJAX call in componentDidMount
    // callcount is used to make sure props must have updated AJAX call
    // then if fetchingDocument still fails, then redirect to user documents
    if (!nextProps.fetchingDocument && this.state.callcount > 0) {
      Materialize.toast(
        `Could not find any document with the id ${editID},
        redirecting...`, 5000, 'red');
      setTimeout(() => {
        this.props.history.push('/dashboard/my-documents');
      }, 5000);
    } else if (!nextProps.fetchingDocument && this.state.callcount === 0) {
      this.props.DocumentActions.getDocument(this.state.editID);
      this.setState({
        callcount: this.state.callcount + 1
      });
    } else if (nextProps.document.ownerId !== this.state.userProfile.userId
      && this.state.userProfile.roleId !== 1) {
      Materialize.toast(
        `You don't have the required access to edit
        document with the id ${editID},
        redirecting...`, 5000, 'red');
      setTimeout(() => {
        this.props.history.push('/dashboard');
      }, 5000);
    } else {
      const { title, content, access } = nextProps.document;
      if (nextProps.count === 0) {
        CKEDITOR.instances.editor.setData(content);
      }
      $('#documentTitle').val(title);
      document.getElementById('documentTitle').focus();
      this.setState({
        title,
        content,
        access
      }, () => {
        if (this.state.currentAction === 'saveExit' && editID) {
          this.props.history.push(`/dashboard/documents/${editID}`);
        }
      });
    }
  }
  /**
   * @desc Handles change event on form input fields
   * @param {object} event -triggered event
   * @memberOf EditDocument
   * @returns {void}
   */
  handleChange(event) {
    const access = event.target.value;
    this.setState({
      access
    });
  }

  /**
   * @desc Send document to server for update
   * @returns {void}
   * @param {object} event - target object
   * @memberOf EditDocument
   */
  save(event) {
    event.preventDefault();
    const currentAction = event.target.getAttribute('id');
    this.setState({ currentAction });
    const title = $('#documentTitle').val() || this.state.title;
    const content = CKEDITOR.instances.editor.getData() || this.state.content;
    const access = this.state.access;
    if (!title) {
      Materialize.toast(
        'The document cannot be save; No Title was supplied!', 5000, 'red');
    } else if (!content) {
      Materialize.toast(
        'Can not save an empty document, please add a content!', 5000, 'red');
    } else if (!access) {
      Materialize.toast(
        'The document cannot be save; No access type was supplied!',
        5000, 'red');
    } else {
      const documentData = {
        title,
        content,
        access,
      };
      this.props.DocumentActions.updateDocument(
        documentData, this.state.editID
      );
    }
  }

  /**
   * @desc Saves a document and redirects to dashboard
   * @returns {void}
   * @param {object} event - target object
   * @memberOf EditDocument
   */
  saveExit(event) {
    this.save(event);
  }

  /**
   * @desc Redirects to dashboard
   * @returns {void}
   * @memberOf EditDocument
   */
  exit() {
    this.props.history.push('/dashboard');
  }

  /**
   * @returns {element} DOM element - div
   * @memberOf EditDocument
   */
  render() {
    const { access, content } = this.state;
    return (
      <PlainEditDocument
        access={access}
        save={this.save}
        saveExit={this.saveExit}
        exit={this.exit}
        content={content}
        handleChange={this.handleChange}
      />
    );
  }
}

EditDocument.defaultProps = {
  document: {},
  count: 0
};

EditDocument.propTypes = {
  match: PropTypes.object.isRequired,
  DocumentActions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  document: PropTypes.object,
  count: PropTypes.number
};

const mapStateToProps = state => ({
  document: state.documentReducer.documents,
  fetchingDocument: state.documentReducer.fetchingDocuments,
  count: state.documentReducer.count
});

const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EditDocument);
