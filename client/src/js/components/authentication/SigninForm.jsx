import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

const SigninForm = ({
  onChange,
  submit,
}) => (
  <div className="row my-container">
    <div className="col s12 m6 offset-m3 white">
      <h3>Signin Here:</h3>
      <form onSubmit={submit}>
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
          <div className="input-field col s12">
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
        </div>
        <div className="row">
          <input
            className={`col s12 m3 waves-effect
              waves-light btn black button-margin`}
            value="Signin"
            type="submit"
            id="signin"
          />
          New User?
          <Link
            className={`col s12 m3 waves-effect
            waves-light btn grey button-margin`}
            to="/signup"
          >
            Signup
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
