/* global Materialize */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as SignupActions from '../../actions/SignupActions';

/**
 * @class Signup
 * @extends {React.Component}
 */
class Signup extends React.Component {
  /**
   * Creates an instance of Signup.
   * @memberOf Signup
   */
  constructor() {
    super();
    this.state = {
      user: {}
    };
    this.submit = this.submit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  /**
   * @desc Handles change events on form input fields
   * @param {object} e
   * @returns {void}
   * @memberOf Signup
   */
  onChange(e) {
    const ref = e.target;
    const inputId = ref.id;
    const value = ref.value;
    const user = this.state.user;
    user[inputId] = value;
    this.setState({
      user
    });
  }

  /**
   * @desc Sends user data to server for signup
   * @returns {void}
   * @memberOf Signup
   */
  submit() {
    const user = this.state.user;
    const { firstName, lastName, password, email } = user;
    if (!firstName || !lastName || !password || !email) {
      Materialize.toast('Please fill on all form fields!', 5000, 'red');
    } else {
      this.props.SignupActions.createUser(this.state.user);
    }
  }

  /**
   * @desc renders component on the DOM
   * @returns {element} - DOM element - div
   * @memberOf Signup
   */
  render() {
    return (<div className="container">
      <div className="row">
        <h3>Signup Here:</h3>
        <form className="col s12" action="#" onSubmit={this.submit}>
          <div className="row">
            <div className="input-field col s6">
              <input
                onChange={this.onChange}
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
                onChange={this.onChange}
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
                onChange={this.onChange}
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
                onChange={this.onChange}
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
              className="waves-effect waves-light btn"
              value="Signup"
              type="submit"
            />
            <Link
              className="waves-effect waves-light btn"
              to="/signin"
            >
              Signin
            </Link>
            If you have already registered.
          </div>
        </form>
      </div>
    </div>);
  }
}

Signup.propTypes = {
  SignupActions: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  SignupActions: bindActionCreators(SignupActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

// export default Signup;
