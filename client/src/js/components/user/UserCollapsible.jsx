import React, { PropTypes } from 'react';

const UserCollapsible = ({
  userId,
  firstName,
  lastName,
  email,
  roleId,
  editUser,
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
      <span> <b>Email:</b> {email} </span><br />
      { roleId === 1 ?
        <span className="right">
          <a
            className="my-zindex-high button-margin"
            onClick={editUser}
            name={userId}
          >
            <i
              className="material-icons my-pointer"
              name={userId}
            >mode_edit</i></a>
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
  email: PropTypes.string.isRequired,
  roleId: PropTypes.number.isRequired,
  editUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired
};

export default UserCollapsible;
