/* global Materialize */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SignupActions from '../../actions/SignupActions';
import SignupForm from './SignupForm';

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
   * @param {object} nextProps - Next props received
   * @return {void} - Returns void
   * @memberOf Signup
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.createdUser) {
      this.props.history.push('/dashboard');
    }
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
    return (
      <SignupForm
        onChange={this.onChange}
        submit={this.submit}
      />
    );
  }
}

Signup.propTypes = {
  SignupActions: PropTypes.object.isRequired,
  createdUser: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  createdUser: state.signUpReducer.createdUser
});

const mapDispatchToProps = dispatch => ({
  SignupActions: bindActionCreators(SignupActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

// export default Signup;
