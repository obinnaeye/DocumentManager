/* global Materialize $ */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UserActions from '../../actions/UserActions';
import PlainEditProfile from './PlainEditProfile';

/**
 * @class EditProfile
 * @extends {React.Component}
 */
class EditProfile extends React.Component {
  /**
   * Creates an instance of EditProfile.
   * @param {object} props
   * @param {object} context
   * @memberOf EditProfile
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      user: {}
    };
    this.updateProfile = this.updateProfile.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  /**
   * @return {void} Returns void
   * @memberOf EditProfile
   */
  componentWillMount() {
    const { roleId } = JSON.parse(localStorage.getItem('user_profile'));
    if (this.props.match.params.id && roleId !== 1) {
      Materialize.toast(
        `You do not have required permission to access this page,
        redirecting...`, 5000, 'red');
      setTimeout(() => {
        this.props.history.push('/dashboard');
      }, 3000);
    }
  }

  /**
   * @return {void} Returns void
   * @memberOf EditProfile
   */
  componentDidMount() {
    const { userId } = JSON.parse(localStorage.getItem('user_profile'));
    const editId = +this.props.match.params.id || userId;
    this.props.UserActions.getUser(editId);
  }

  /**
   * @param {object} nextProps
   * @returns {void}
   * @memberOf EditProfile
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.user
    });
  }
  /**
   * @desc Handles change events on form input fields
   * @param {object} event - triggered event
   * @returns {void}
   * @memberOf EditProfile
   */
  onChange(event) {
    const { user } = this.state;
    const name = event.target.getAttribute('id');
    const value = event.target.value;
    user[name] = value;
    this.setState({
      user
    });
  }

  /**
   * @desc Updates user profile
   * @returns {void}
   * @memberOf EditProfile
   */
  updateProfile() {
    const { userId } = this.state.user;
    const oldPassword = $('#oldPassword').val();
    const password = $('#password').val();
    const passwordConfirm = $('#passwordConfirm').val();
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const updateData = { lastName, firstName, oldPassword };
    const updateInfo = { updateData, userId };
    if (password) {
      if (password.length < 8) {
        Materialize.toast(`Password must be up to 8 characters<br />
        You can leave password blank if you do not want 
        to change your password`,
          5000, 'red');
        return;
      }
      if (password !== passwordConfirm) {
        Materialize.toast('Passwords do not match!',
          5000, 'red');
        return;
      }
    }
    // add password if up to 8 characters
    if (password.length > 7) {
      updateInfo.updateData.password = password;
    }

    this.props.UserActions.updateUser(updateInfo);
  }

  /**
   * @returns {element} DOM element - div
   * @memberOf EditProfile
   */
  render() {
    const { firstName, lastName, email } = this.state.user;
    return (
      <PlainEditProfile
        firstName={firstName}
        lastName={lastName}
        email={email}
        onChange={this.onChange}
        updateProfile={this.updateProfile}
      />
    );
  }
}

EditProfile.defaultProps = {
  updatingUser: false,
  fetchingUser: false
};

EditProfile.propTypes = {
  UserActions: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  updatingUser: state.userReducers.updatingUser,
  user: state.userReducers.user,
  fetchingUser: state.userReducers.fetchingUser
});

const mapDispatchToProps = dispatch => ({
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
