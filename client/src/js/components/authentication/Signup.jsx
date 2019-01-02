/* global Materialize jwt_decode */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as SignupActions from '../../actions/SignupActions';
import * as UserActions from '../../actions/UserActions';
import SignupForm from './SignupForm';
import Preloader from '../../helper/Preloader';

/**
 * @class Signup
 * @extends {React.Component}
 */
class Signup extends React.Component {
  /**
   * Creates an instance of Signup.
   * @memberOf Signup
   * @param {object} props - componet props
   */
  constructor(props) {
    super(props);
    this.state = {
      createdUser: this.props.createdUser,
      authenticated: this.props.authenticated,
      signingIn: this.props.signingIn,
      count: this.props.count,
      user: {}
    };
    this.submit = this.submit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  /**
   * @memberof Signup
   * @returns {void}
   */
  componentDidMount() {
    if (localStorage.accessToken) {
      const { userId } = jwt_decode(localStorage.accessToken);
      this.props.UserActions.validateUser(userId);
    }
  }

  /**
   * @param {object} nextProps - Next props received
   * @return {void} - Returns void
   * @memberOf Signup
   */
  componentWillReceiveProps(nextProps) {
    const { authenticated, signingIn, createdUser, count } = nextProps;
    this.setState({
      authenticated,
      signingIn,
      createdUser,
      count
    });
  }

  /**
   * @desc Handles change events on form input fields
   * @param {object} event - triggered event
   * @returns {void}
   * @memberOf Signup
   */
  onChange(event) {
    const ref = event.target;
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
    const { firstName, lastName, password, email, passwordConfirm } = user;
    if (!firstName || !lastName || !password || !email) {
      Materialize.toast('Please fill on all form fields!', 5000, 'red');
    } else if (password !== passwordConfirm) {
      Materialize.toast('Passwords do not match!', 5000, 'red');
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
    const { authenticated, signingIn, createdUser, count } = this.state;
    const condition = (!authenticated && !signingIn && !createdUser);
    const signupForm = (
      <SignupForm
        onChange={this.onChange}
        submit={this.submit}
      />);
    const redirect = <Redirect to="/dashboard" />;
    return (
      Preloader(count, condition, signupForm, redirect)
    );
  }
}

Signup.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  signingIn: PropTypes.bool.isRequired,
  UserActions: PropTypes.object.isRequired,
  SignupActions: PropTypes.object.isRequired,
  createdUser: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  createdUser: state.userReducers.createdUser,
  authenticated: state.userReducers.authenticated,
  signingIn: state.userReducers.signingIn,
  count: state.userReducers.count
});

const mapDispatchToProps = dispatch => ({
  SignupActions: bindActionCreators(SignupActions, dispatch),
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
