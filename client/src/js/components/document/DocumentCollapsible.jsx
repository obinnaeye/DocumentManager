import React, { PropTypes } from 'react';

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
  <li key={id}>
    <div className="collapsible-header">
      <i className="material-icons orange">library_books</i>
      <span><b>Title: </b> <em>{title} </em> ||</span>
      <span> <b>Created:</b> <em>{createdAt}</em> ||</span>
      <span> <b>Modified:</b> <em>{updatedAt}</em> </span>
      { userId === ownerId || roleId === 1 ?
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
          >
            <i
              className="material-icons"
              name={id}
            >delete</i></a>
        </span> : ''}
    </div>
    <div className="collapsible-body white">{parsedContent}</div>
  </li>);

DocumentCollapsible.defaultProps = {
  viewDocument: () => true,
  deleteDocument: () => true
};

DocumentCollapsible.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  ownerId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  roleId: PropTypes.number.isRequired,
  parsedContent: PropTypes.element.isRequired,
  viewDocument: PropTypes.func,
  deleteDocument: PropTypes.func
};

export default DocumentCollapsible;
