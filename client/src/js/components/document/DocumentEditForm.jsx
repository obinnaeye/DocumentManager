import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';

class DocumentEditForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    CKEDITOR.replace('editor');
    $('select').material_select();
  }

  save() {
    const title = $('#documentTitle').val();
    const content = CKEDITOR.instances.editor.getData();
    const access = $('#access').val();
    if (!title) {
      alert('The document cannot be save; No Title was supplied!');
    } else if (!content){
      alert('Can not save a empty document, please add a content!');
    } else if (!access){
      alert('The document cannot be save; No access type was supplied!');
    } else {
      const documentData = {
        title,
        content,
        access
      };
      this.props.DocumentActions.createDocument(documentData)
        .then((response) => {
          console.log('newdoc', response);
        });
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
