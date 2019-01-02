import React, { PropTypes } from 'react';

const PlainDocumentView = ({
  title,
  parsedContent,
  editDocument,
  id,
  deleteDocument
}) => (
  <div className="container row">
    <div className="col s12 m12">
      <div className="card white darken-1">
        <div className="card-content black-text">
          <span className="card-title">
            <strong>{title}</strong></span>
          <div>{parsedContent}</div>
        </div>
        <div className="card-action">
          <button
            className="btn orange button-margin"
            onClick={editDocument}
            name={id}
          >
            <i
              className="material-icons"
              name={id}
            >mode_edit</i></button>
          <button
            className=" btn red lighten-2 button-margin"
            onClick={deleteDocument}
            name={id}
          >
            <i
              className="material-icons"
              name={id}
            >delete</i></button>
        </div>
      </div>
    </div>
  </div>
);

PlainDocumentView.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  editDocument: PropTypes.func.isRequired,
  parsedContent: PropTypes.element.isRequired
};

export default PlainDocumentView;
