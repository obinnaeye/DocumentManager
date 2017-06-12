import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';

class DocumentEditForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      title: '',
      content: '',
      access: ''
    };
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    CKEDITOR.replace('editor');
    $('select').material_select();
  }

  save() {
    // if (this.state.update) {
    //   return this.props.DocumentActions.updateDocument(data);
    // }
    const title = $('#documentTitle').val() || this.state.title;
    const content = CKEDITOR.instances.editor.getData() || this.state.content;
    const access = $('#access').val() || this.state.access;
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
      this.props.DocumentActions.createDocument(documentData);
    }
  }

  render() {
    return (
      <div className="row center-align">
        <div className="row center-align">
          <div className="input-field col s5">
            <input id="documentTitle" type="text" className="validate" />
            <label htmlFor="documentTitle">Title: Unique Title</label>
          </div>
          <div className="input-field col s5 center-align">
            <select id="access">
              <option value="" disabled selected>Choose Access Type</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="role">Role</option>
            </select>
          </div>
        </div>
        <div className="col s10 center-align" >
          <textarea name="editor" id="editor" />
        </div>
        <button onClick={this.save}>Save</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.signInReducer.user
});



const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentEditForm);
