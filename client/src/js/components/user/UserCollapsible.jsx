import React, { PropTypes } from 'react';

const UserCollapsible = ({
  userId,
  firstName,
  lastName,
  role,
  roleId,
  deleteUser
}) => (
  <li key={userId}>
    <div className="collapsible-header">
      <i className="material-icons orange">person</i>
      <span><b>First Name: </b>
        <em>{firstName}</em></span>
    </div>
    <div className="collapsible-body white">
      <span> <b>FirstName:</b> {firstName} </span><br />
      <span> <b>LastName:</b> {lastName} </span><br />
      <span> <b>Role:</b> {role} </span><br />
      { roleId === 1 && role !== 'Admin' ?
        <span className="right">
          <a
            className="my-danger lighten-2 my-zindex-high button-margin"
            onClick={deleteUser}
            name={userId}
          >
            <i
              className="material-icons my-pointer"
              name={userId}
            >delete</i></a>
        </span> : ''}
    </div>
  </li>
);

UserCollapsible.propTypes = {
  userId: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  roleId: PropTypes.number.isRequired,
  deleteUser: PropTypes.func.isRequired
};

export default UserCollapsible;
