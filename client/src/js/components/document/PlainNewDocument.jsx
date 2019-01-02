import React, { PropTypes } from 'react';

const PlainNewDocument = ({
  saveExit,
  save,
  exit
}) => (
  <div className="row center-align white new-doc" id="my-container" >
    <div className="row center-align">
      <div className="input-field col m5 s6">
        <input id="documentTitle" type="text" className="validate" />
        <label htmlFor="documentTitle">Title: Unique Title</label>
      </div>
      <div className="input-field col m4 s6 center-align">
        <select id="access">
          <option value="" disabled selected>Choose Access Type</option>
          <option value="private">Private</option>
          <option value="public">Public</option>
          <option value="role">Role</option>
        </select>
      </div>
    </div>
    <div className="row">
      <div className="col s12 m9 center" >
        <textarea name="editor" id="editor" />
      </div>
      <div className="col s12 m3 edit-document-buttons">
        <button
          className="btn waves-effect waves-light orange accent-3"
          onClick={save}
          id="save"
        >Save</button><br />
        <button
          className="btn waves-effect waves-light orange accent-3"
          onClick={saveExit}
          id="saveExit"
        >Save and Exit</button><br />
        <button
          className="btn waves-effect waves-light red lighten-2"
          onClick={exit}
          id="exit"
        >Exit</button>
      </div>
    </div>
  </div>
);

PlainNewDocument.propTypes = {
  save: PropTypes.func.isRequired,
  saveExit: PropTypes.func.isRequired,
  exit: PropTypes.func.isRequired
};

export default PlainNewDocument;
