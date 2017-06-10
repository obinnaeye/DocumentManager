import React from 'react';

const DocumentCarousel = props =>
  (
    <div className="carousel-item" >
      <h5> {props.title} </h5>
      <p> {props.content} </p>
      <a
        id="carousel-view"
        className="btn-floating waves-effect waves-light red"
        onClick={props.viewCarousel}
      >
        <i className="material-icons">View</i>
      </a>
    </div>
  );

export default DocumentCarousel;
