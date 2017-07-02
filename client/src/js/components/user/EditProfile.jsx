/* global Materialize $ */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UserActions from '../../actions/UserActions';

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
      user: props.user || JSON.parse(localStorage.getItem('user_profile'))
    };
    this.updateProfile = this.updateProfile.bind(this);
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
    if (this.props.match.params.id) {
      const userId = this.props.match.params.id;
      this.props.UserActions.getUser(userId);
    }
  }

  /**
   * @param {object} nextProps
   * @returns {void}
   * @memberOf EditProfile
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id && nextProps.fetchingUser) {
      this.setState({
        user: nextProps.user
      }, () => {
      });
      return;
    }
    if (!nextProps.updatingUser && !this.props.updatingUser) {
      Materialize.toast(
        'Profile update failed, please try again later!', 5000, 'red');
    }
  }

  /**
   * Make a PUT call to update user profile
   * @returns {void}
   * @memberOf EditProfile
   */
  updateProfile() {
    const { userId } = this.props.match.params.id ||
    JSON.parse(localStorage.getItem('user_profile'));
    const password = $('#password').val();
    const firstName = $('#first_name').val();
    const lastName = $('#last_name').val();
    const updateInfo = { firstName, lastName, userId };

    if (password && password.length < 8) {
      Materialize.toast(`Password must be up to 8 characters<br />
      You can leave password blank if you do not want to change your password`,
         5000, 'red');
      return;
    }
    // add password if up to 8 characters
    if (password.length > 7) {
      updateInfo.password = password;
    }
    this.props.UserActions.updateUser(updateInfo)
      .then(() => {
        Materialize.toast('Profile updated successfully!', 3000, 'green');
      });
  }

  /**
   * @returns {element} DOM element - div
   * @memberOf EditProfile
   */
  render() {
    const { firstName, lastName, email } = this.state.user;
    return (
      <div className="row container center-align white">
        <form className="col s12" onSubmit={this.updateProfile}>
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
              <input id="password" type="password" className="validate" />
              <label
                htmlFor="password"
              >Password: Not less than 8 characters</label>
            </div>
            <div className="input-field col s12 m6">
              <input
                value={firstName}
                id="first_name"
                type="text"
                className="validate"
              />
              <label className="active" htmlFor="first_name">First Name</label>
            </div>
            <div className="input-field col s12 m6">
              <input
                value={lastName}
                id="last_name"
                type="text"
                className="validate"
              />
              <label className="active" htmlFor="last_name">Last Name</label>
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
  }
}

EditProfile.defaultProps = {
  updatingUser: false,
  fetchingUser: false
};

EditProfile.propTypes = {
  updatingUser: PropTypes.bool,
  fetchingUser: PropTypes.bool,
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
