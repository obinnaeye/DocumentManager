/* global CKEDITOR $ Materialize */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';
import Select from './Select';

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
      access: 'Select Document Access Types',
      callcount: 0,
      userProfile: JSON.parse(localStorage.user_profile)
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
    // then if fetchingDocument is still falls, then redirect to user documents
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
        this.props.history.push('/dashboard/my-documents');
      }, 5000);
    } else {
      const { title, content, access } = nextProps.document;
      const sentenceCaseAccess =
        access.substr(0, 1).toUpperCase() + access.substr(1);
      CKEDITOR.instances.editor.setData(content);
      $('#documentTitle').val(title);
      document.getElementById('documentTitle').focus();
      this.setState({
        title,
        content,
        access: sentenceCaseAccess
      });
    }
  }
  /**
   * @desc Handles change event on form input fields
   * @param {object} e
   * @memberOf EditDocument
   * @returns {void}
   */
  handleChange(e) {
    const access = e.target.getAttribute('id');
    this.setState({
      access
    });
  }

  /**
   * @desc Send document to server for update
   * @returns {void}
   * @memberOf EditDocument
   */
  save() {
    const title = $('#documentTitle').val() || this.state.title;
    const content = CKEDITOR.instances.editor.getData() || this.state.content;
    const sentenceCaseAccess = $('#access').val() || this.state.access;
    const access =
      sentenceCaseAccess.substr(0, 1).toLowerCase() +
      sentenceCaseAccess.substr(1);
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
        access
      };
      this.props.DocumentActions.updateDocument(
        documentData, this.state.editID
      );
    }
  }

  /**
   * @desc Saves a document and redirects to dashboard
   * @returns {void}
   * @memberOf EditDocument
   */
  saveExit() {
    this.save();
    this.exit();
  }

  /**
   * @desc Redirects to dashboard
   * @returns {void}
   * @memberOf EditDocument
   */
  exit() {
    this.props.history.push('/dashboard/my-documents');
  }

  /**
   * @returns {element} DOM element - div
   * @memberOf EditDocument
   */
  render() {
    return (
      <div className="row center-align edit-document-container">
        <div className="row center-align">
          <div className="input-field col s5">
            <input id="documentTitle" type="text" className="validate" />
            <label htmlFor="documentTitle">Title: Unique Title</label>
          </div>
          <div>
            Select Document Access Types
          </div>
          <div className="input-field col s5 center-align">
            <Select
              access={this.state.access}
              onClick={this.handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col s12 m10 center" >
            <textarea name="editor" id="editor" value={this.state.content} />
          </div>
          <div className="col s12 m2 edit-document-buttons">
            <button
              className="btn waves-effect waves-light orange accent-3"
              onClick={this.save}
            >Save</button><br />
            <button
              className="btn waves-effect waves-light orange accent-3"
              onClick={this.saveExit}
            >Save and Exit</button><br />
            <button
              className="btn waves-effect waves-light red lighten-2"
              onClick={this.exit}
            >Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

EditDocument.propTypes = {
  match: PropTypes.object.isRequired,
  DocumentActions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  document: state.documentReducer.documents,
  fetchingDocument: state.documentReducer.fetchingDocuments
});

const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EditDocument);
