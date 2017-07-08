import React, { PropTypes } from 'react';

const PlainEditDocument = ({
  access,
  handleChange,
  saveExit,
  save,
  exit,
  content
}) => (
  <div className="row center-align edit-document-container white">
    <div className="row center-align">
      <div className="input-field col s5">
        <input id="documentTitle" type="text" className="validate" />
        <label htmlFor="documentTitle">Title: Unique Title</label>
      </div>
      <div className="input-field col s5 center-align">
        <select
          className="browser-default"
          onChange={handleChange}
          id="access"
          value={access}
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
          <option value="role">Role</option>
        </select>
      </div>
    </div>
    <div className="row">
      <div className="col s12 m9 center" >
        <textarea name="editor" id="editor" value={content} />
      </div>
      <div className="col s12 m3 edit-document-buttons">
        <button
          className="btn waves-effect waves-light orange accent-3"
          onClick={save}
        >Save</button><br />
        <button
          className="btn waves-effect waves-light orange accent-3"
          onClick={saveExit}
        >Save and Exit</button><br />
        <button
          className="btn waves-effect waves-light red lighten-2"
          onClick={exit}
        >Exit</button>
      </div>
    </div>
  </div>
);

PlainEditDocument.propTypes = {
  access: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  saveExit: PropTypes.func.isRequired,
  exit: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired
};

export default PlainEditDocument;
