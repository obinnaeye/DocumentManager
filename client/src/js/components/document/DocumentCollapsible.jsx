import React, { PropTypes } from 'react';

const truncator = (word, length) => {
  if (word.length > length) {
    word = `${word.substr(0, length - 3)}...`;
  }
  return word;
};

const DocumentCollapsible = ({
  id,
  title,
  createdAt,
  updatedAt,
  ownerId,
  userId,
  roleId,
  parsedContent,
  viewDocument,
  deleteDocument
}) => (
  <li>
    <div className="collapsible-header row">
      <div className="col s12 m10">
        <i className="material-icons orange">library_books</i>
        <span><b>Title: </b> <em>{truncator(title, 30)} </em> ||</span>
        <span> <b>Created:</b>
          <em>{String(new Date(createdAt)).substr(0, 24)}</em> ||</span>
        <span> <b>Modified:</b>
          <em>{String(new Date(updatedAt)).substr(0, 24)}</em> </span>
      </div>
      { userId === ownerId || roleId === 1 ?
        <div className="col col s12 m2">
          <span className="right">
            <a
              className="my-zindex-high"
              onClick={viewDocument}
              name={id}
            >
              <i
                className="material-icons"
                name={id}
              >pageview</i></a>
            <a
              className=" my-danger lighten-2 my-zindex-high"
              onClick={deleteDocument}
              name={id}
              id={id}
            >
              <i
                className="material-icons"
                name={id}
              >delete</i></a>
          </span>
        </div> : ''}
    </div>
    <div className="collapsible-body white">{parsedContent}</div>
  </li>);

DocumentCollapsible.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  ownerId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  roleId: PropTypes.number.isRequired,
  parsedContent: PropTypes.element.isRequired,
  viewDocument: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired
};

export default DocumentCollapsible;
