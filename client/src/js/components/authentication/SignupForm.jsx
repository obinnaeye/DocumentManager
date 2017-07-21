import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

const SigninForm = ({
  onChange,
  submit,
}) => (
  <div className="container">
    <div className="row white my-container">
      <h3>Signup Here:</h3>
      <form className="col s12" onSubmit={submit}>
        <div className="row">
          <div className="input-field col s6">
            <input
              onChange={onChange}
              id="firstName"
              type="text"
              className="validate"
              required=""
              aria-required="true"
            />
            <label
              htmlFor="firstName"
              data-error="wrong"
              data-success="ok"
            >
            First Name
            </label>
          </div>
          <div className="input-field col s6">
            <input
              onChange={onChange}
              id="lastName"
              type="text"
              className="validate"
              required=""
              aria-required="true"
            />
            <label
              htmlFor="lastName"
              data-error="wrong"
              data-success="ok"
            >
              Last Name
            </label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input
              onChange={onChange}
              id="email"
              type="email"
              className="validate"
              required=""
              aria-required="true"
            />
            <label
              htmlFor="email"
              data-error="wrong"
              data-success="ok"
            >
              Email: (user@domain.com)
            </label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <input
              onChange={onChange}
              id="password"
              type="password"
              className="validate"
              required=""
              aria-required="true"
            />
            <label htmlFor="password">
              Password: (Not less than 8 characters)
            </label>
          </div>
          <div className="input-field col s6">
            <input
              onChange={onChange}
              id="passwordConfirm"
              type="password"
              className="validate"
              required=""
              aria-required="true"
              autoComplete="off"
            />
            <label htmlFor="passwordConfirm">
              Password: (Confirm password)
            </label>
          </div>
        </div>
        <div className="row">
          <input
            className={`col s12 m3 waves-effect waves-light 
            btn black button-margin`}
            value="Signup"
            type="submit"
            id="signup"
          />
          <em>If you have already registered...</em>
          <Link
            className={`col m3 s12 waves-effect 
            waves-light btn grey button-margin`}
            to="/signin"
          >
            Signin
          </Link>
        </div>
      </form>
    </div>
  </div>);

SigninForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired
};

export default SigninForm;
