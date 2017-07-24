
import React, { PropTypes } from 'react';

const PlainEditProfile = ({
  firstName,
  lastName,
  updateProfile,
  email,
  onChange
}) => (
  <div className="row container center-align white">
    <form className="col s12" onSubmit={updateProfile}>
      <div className="row ">
        <div className="input-field col s12 m6">
          <input
            disabled
            value={email}
            id="disabled"
            type="text"
            className="validate"
          />
          <label htmlFor="disabled" className="active">
          User email is not editable!</label>
        </div>
        <div className="input-field col s12 m6">
          <input
            id="oldPassword"
            type="password"
            className="validate"
            required
            aria-required="true"
          />
          <label
            htmlFor="oldPassword"
          >Password: Current Password</label>
        </div>
        <div className="input-field col s12 m6">
          <input id="password" type="password" className="validate" />
          <label
            htmlFor="password"
          >New Password: Not less than 8 characters</label>
        </div>
        <div className="input-field col s12 m6">
          <input
            id="passwordConfirm"
            type="password"
            className="validate"
            autoComplete="off"
          />
          <label htmlFor="passwordConfirm">
            New Password: (Confirm password)
          </label>
        </div>
        <div className="input-field col s12 m6">
          <input
            value={firstName}
            id="firstName"
            type="text"
            className="validate"
            onChange={onChange}
            required
            aria-required="true"
          />
          <label className="active" htmlFor="firstName">First Name</label>
        </div>
        <div className="input-field col s12 m6">
          <input
            value={lastName}
            id="lastName"
            type="text"
            className="validate"
            onChange={onChange}
            required
            aria-required="true"
          />
          <label className="active" htmlFor="lastName">Last Name</label>
        </div>
        <input
          className="btn orange"
          type="submit"
          value="Update Profile"
        />
      </div>
    </form>
  </div>
);

PlainEditProfile.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  updateProfile: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default PlainEditProfile;
