import React from 'react';

const DocumentCard = props =>
  (<div className="row">
    <div className="col s12 m7">
      <div className="card">
        <div className="card-image">
          <img src={props.image} alt="document icon" />
          <span className="card-title">{props.title}</span>
        </div>
        <div className="card-content">
          <p>{props.title}</p>
        </div>
        <div className="card-action" onClick={props.open}>
          <button> Open </button>
        </div>
      </div>
    </div>
  </div>);

export default DocumentCard;

