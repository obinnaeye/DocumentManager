/* global CKEDITOR $ Materialize */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';
import PlainNewDocument from './PlainNewDocument';

/**
 * @class NewDocument
 * @extends {React.Component}
 */
class NewDocument extends React.Component {

  /**
   * Creates an instance of NewDocument.
   * @param {object} props
   * @param {object} context
   * @memberOf NewDocument
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      editMode: false,
      editID: null
    };
    this.save = this.save.bind(this);
    this.saveExit = this.saveExit.bind(this);
    this.exit = this.exit.bind(this);
  }

  /**
   * @memberOf NewDocument
   * @returns {void}
   */
  componentDidMount() {
    CKEDITOR.replace('editor', {
      uiColor: '#ffa726'
    });
    $('select').material_select();
  }

  /**
   * @param {object} nextProps
   * @memberOf NewDocument
   * @returns {void}
   */
  componentWillReceiveProps(nextProps) {
    const { editID } = nextProps;
    this.setState({
      editID
    });
  }

  /**
   * @desc Saves document
   * @memberOf NewDocument
   * @returns {void}
   */
  save() {
    const title = $('#documentTitle').val() || this.state.title;
    const content = CKEDITOR.instances.editor.getData() || this.state.content;
    const access = $('#access').val() || this.state.access;
    if (!title) {
      Materialize.toast(
        'The document cannot be save; No Title was supplied!', 5000, 'red');
    } else if (!content) {
      Materialize.toast(
        'Can not save an empty document, please add a content!', 5000, 'red');
    } else if (!access) {
      Materialize.toast(
      'The document cannot be save; No access type was supplied!', 5000, 'red');
    } else {
      const documentData = {
        title,
        content,
        access
      };
      if (this.state.editMode) {
        this.props.DocumentActions.updateDocument(
          documentData, this.state.editID
        );
      } else {
        this.props.DocumentActions.createDocument(documentData)
          .then(() => {
            this.setState({
              editMode: true
            });
          }
        );
      }
    }
  }

  /**
   * @desc Saves a document and redirects to dashboard
   * @returns {void}
   * @memberOf NewDocument
   */
  saveExit() {
    this.save();
    this.exit();
  }

  /**
   * @desc Redirects to dashboard
   * @returns {void}
   * @memberOf NewDocument
   */
  exit() {
    this.props.history.push('/dashboard/my-documents');
  }

  /**
   * @returns {element} DOM element
   * @memberOf NewDocument
   */
  render() {
    return (
      <PlainNewDocument
        save={this.save}
        saveExit={this.saveExit}
        exit={this.exit}
      />
    );
  }
}

NewDocument.defaultProps = {
  editID: ''
};

NewDocument.propTypes = {
  editID: PropTypes.string,
  DocumentActions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  editID: state.documentReducer.editID || null
});

const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NewDocument);
