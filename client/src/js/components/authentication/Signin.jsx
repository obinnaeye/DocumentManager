/* global Materialize jwt_decode */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as SigninActions from '../../actions/SigninActions';
import * as UserActions from '../../actions/UserActions';

/**
 *
 * @class Signin
 * @extends {React.Component}
 */
class Signin extends React.Component {
  /**
   * Creates an instance of Signin.
   * @param {object} props
   * @memberOf Signin
   */
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
    this.submit = this.submit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  /**
   * @memberOf Signin
   * @returns {void}
   */
  componentDidMount() {
    if (!this.props.authenticated && !this.props.signingIn &&
    !this.props.createdUser) {
      const { userId } = jwt_decode(localStorage.xsrf_token);
      this.props.UserActions.validateUser(userId);
    }
  }
  /**
   * @param {object} nextProps - Next props received
   * @return {void} - Returns void
   * @memberOf Signin
   */
  componentWillReceiveProps(nextProps) {
    const { authenticated, signingIn, createdUser } = nextProps;
    if (authenticated || signingIn || createdUser) {
      this.props.history.push('/dashboard');
    }
  }
  /**
   *
   * @param {object} e
   * @memberOf Signin
   * @returns {void}
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
   * @memberOf Signin
   * @return {void}
   */
  submit() {
    const user = this.state.user;
    const { password, email } = user;
    if (!password || !email) {
      Materialize.toast('Please fill on all form fields!', 5000, 'red');
    } else {
      this.props.SigninActions.signinUser(this.state.user);
    }
  }
  /**
   * @returns {element} - DOM element - div
   * @memberOf Signin
   */
  render() {
    return (
      <div className="row my-container">
        <div className="col s12 m6 offset-m3 white">
          <h3>Signin Here:</h3>
          <form onSubmit={this.submit}>
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
                className={`col s12 m3 waves-effect
                  waves-light btn black button-margin`}
                value="Signin"
                type="submit"
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
  }
}

Signin.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  signingIn: PropTypes.bool.isRequired,
  UserActions: PropTypes.object.isRequired,
  createdUser: PropTypes.bool.isRequired,
  SigninActions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.userReducers.authenticated,
  signingIn: state.signInReducer.signingIn,
  createdUser: state.signUpReducer.createdUser,
  user: state.signInReducer.user
});

const mapDispatchToProps = dispatch => ({
  SigninActions: bindActionCreators(SigninActions, dispatch),
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
