/* global Materialize jwt_decode */
import React, { PropTypes } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SigninActions from '../../actions/SigninActions';
import * as UserActions from '../../actions/UserActions';
import SigninForm from './SigninForm';
import Preloader from '../../helper/Preloader';

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
      createdUser: false,
      authenticated: false,
      signingIn: false,
      count: 0,
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
    if (localStorage.accessToken) {
      const { userId } = jwt_decode(localStorage.accessToken);
      this.props.UserActions.validateUser(userId);
    }
  }
  /**
   * @param {object} nextProps - Next props received
   * @return {void} - Returns void
   * @memberOf Signin
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
   * @memberOf Signin
   * @returns {void}
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
   * @desc    * @desc Sends user data to server for signin
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
    const { authenticated, signingIn, createdUser, count } = this.state;
    const condition = (!authenticated && !signingIn && !createdUser);
    const signinForm = (
      <SigninForm
        onChange={this.onChange}
        submit={this.submit}
      />);
    const redirect = <Redirect to="/dashboard" />;
    return (
      Preloader(count, condition, signinForm, redirect)
    );
  }
}

Signin.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  signingIn: PropTypes.bool.isRequired,
  UserActions: PropTypes.object.isRequired,
  createdUser: PropTypes.bool.isRequired,
  SigninActions: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.userReducers.authenticated,
  signingIn: state.userReducers.signingIn,
  createdUser: state.userReducers.createdUser,
  count: state.userReducers.count
});

const mapDispatchToProps = dispatch => ({
  SigninActions: bindActionCreators(SigninActions, dispatch),
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
