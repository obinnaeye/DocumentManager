import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';
import Select from './Select';

class EditDocument extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editID: props.match.params.id,
      access: 'Select Document Access Types'
    };
    this.save = this.save.bind(this);
    this.saveExit = this.saveExit.bind(this);
    this.exit = this.exit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    CKEDITOR.replace('editor');
    $('select').material_select();
    this.props.DocumentActions.getDocument(this.state.editID);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.fetchingDocument) {
      const { editID } = this.state;
      Materialize.toast(`Could not find any document with the id ${editID}, redirecting...`, 5000, 'red');
      setTimeout(() => {
        this.props.history.push('/dashboard/my-documents');
      }, 5000);
    } else {
      console.log(nextProps.document)
      const { title, content, access } = nextProps.document;
      const sentenceCaseAccess = access.substr(0, 1).toUpperCase() + access.substr(1);
      CKEDITOR.instances['editor'].setData(content);
      $('#documentTitle').val(title);
      document.getElementById('documentTitle').focus();
      this.setState({
        title,
        content,
        access: sentenceCaseAccess
      });
    } 
  }

  handleChange(e) {
    const access = e.target.getAttribute('id');
    this.setState({
      access
    });
  }

  save() {
    const title = $('#documentTitle').val() || this.state.title;
    const content = CKEDITOR.instances.editor.getData() || this.state.content;
    const sentenceCaseAccess = $('#access').val() || this.state.access;
    const access = sentenceCaseAccess.substr(0, 1).toLowerCase() + sentenceCaseAccess.substr(1);
    if (!title) {
      Materialize.toast('The document cannot be save; No Title was supplied!', 5000, 'red');
    } else if (!content){
      Materialize.toast('Can not save an empty document, please add a content!', 5000, 'red');
    } else if (!access){
      Materialize.toast('The document cannot be save; No access type was supplied!', 5000, 'red');
    } else {
      const documentData = {
        title,
        content,
        access
      };
      this.props.DocumentActions.updateDocument(documentData, this.state.editID);
    }
  }

  saveExit() {
    this.save();
    this.props.history.push('/dashboard/my-documents');
  }

  exit() {
    this.props.history.push('/dashboard/my-documents');
  }

  render() {
    return (
      <div className="row center-align">
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
        <div className="col s10 center-align" >
          <textarea name="editor" id="editor" />
        </div>
        <div>
          <button className="btn waves-effect waves-light light-green darken-4" onClick={this.save}>Save</button><br />
          <button className="btn waves-effect waves-light light-green darken-4" onClick={this.saveExit}>Save and Exit</button><br />
          <button className="btn waves-effect waves-light red darken-4" onClick={this.exit}>Cancel</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  document: state.documentReducer.documents,
  fetchingDocument: state.documentReducer.fetchingDocuments
});



const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EditDocument);
