import React from 'react';

const DocumentEdit = props =>
  (
    <div className="row">
      <div className="row">
        <div className="input-field col s6">
          <input id="documentTitle" type="text" className="validate" />
          <label htmlFor="documentTitle">Last Name</label>
        </div>
        <div className="input-field col s12">
          <select onChange={props.accessChange}>
            <option value="" disabled selected>Choose Access Type</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="role">Role</option>
          </select>
        </div>
      </div>
      <textarea name="editor" onChange={props.contentChange} />
      <script>
          CKEDITOR.replace( `editor1` );
      </script>
    </div>
  );
