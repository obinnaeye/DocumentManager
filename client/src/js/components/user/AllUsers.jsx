/* global $ Materialize */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UserActions from '../../actions/UserActions';
import UserCollapsible from './UserCollapsible';
import PlainAllUsers from './PlainAllUsers';

/**
 * @class AllUsers
 * @extends {React.Component}
 */
class AllUsers extends React.Component {

  /**
   * Creates an instance of AllUsers.
   * @param {object} props
   * @param {object} context
   * @returns {void}
   * @memberOf AllUsers
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      users: this.props.users,
      offset: 0,
      limit: 10
    };

    this.renderedUsers = this.renderedUsers.bind(this);
    this.editUser = this.editUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  /**
   * @memberOf AllUsers
   * @returns {void}
   */
  componentDidMount() {
    this.getUsers();
  }

  /**
   * @param {object} nextProps
   * @returns {void}
   * @memberOf AllUsers
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.users.length > 0) {
      this.setState({
        users: nextProps.users,
        fetchingUsers: nextProps.fetchingUsers,
        count: nextProps.count
      });
    }
  }

  /**
   * @return {void} Returns void
   * @memberOf AllDocuments
   */
  componentDidUpdate() {
    $('.collapsible').collapsible();
    this.props = this.props;
  }

  /**
   * @desc - Method that gets all user instances
   * @return {void} - Returns void
   * @memberOf AllUsers
   */
  getUsers() {
    const { offset, limit } = this.state;
    this.props.UserActions.getUsers(offset, limit);
  }

  /**
   * @desc Redirects to edit page using user id
   * @param {object} e
   * @memberOf AllUsers
   * @returns {void}
   */
  editUser(e) {
    e.preventDefault();
    const id = e.target.getAttribute('name');
    this.props.history.push(`/dashboard/edit-user/${id}`);
  }

  /**
   * @desc Delets a docuement and redirects to users page
   * @param {object} e
   * @memberOf AllUsers
   * @returns {void}
   */
  deleteUser(e) {
    e.preventDefault();
    const id = e.target.getAttribute('name');
    this.props.UserActions.deleteUser(id);
  }

  /**
   * @desc - Method that handles change events
   * @param {objcet} e - event target
   * @return {void} - Returns void
   * @memberOf AllUsers
   */
  inputChange(e) {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.getAttribute('id');
    if (value < 0) {
      Materialize.toast(`${name} can not be negative`, 3000, 'red');
      return;
    }
    this.setState({
      [name]: value
    }, this.getUsers);
  }

  /**
   * Formats user for rendering
   * @returns {element} DOM element
   * @memberOf AllUsers
   */
  renderedUsers() {
    if (this.state.fetchingUsers) {
      const users = this.state.users;
      const { roleId } =
        JSON.parse(localStorage.getItem('user_profile'));
      const render = users.map((user) => {
        const { firstName, lastName, email, userId } = user;
        return (
          <UserCollapsible
            roleId={roleId}
            firstName={firstName}
            lastName={lastName}
            email={email}
            userId={userId}
            editUser={this.editUser}
            deleteUser={this.deleteUser}
          />
        );
      });
      return render;
    }
  }

  /**
   * @returns {element} DOM element div
   * @memberOf AllUsers
   */
  render() {
    const { users, limit, offset } = this.state;

    return (
      <PlainAllUsers
        limit={limit}
        offset={offset}
        users={users}
        inputChange={this.inputChange}
        renderedUsers={this.renderedUsers}
      />
    );
  }
}

AllUsers.propTypes = {
  users: PropTypes.array.isRequired,
  UserActions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchingUsers: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  users: state.userReducers.users,
  fetchingUsers: state.userReducers.fetchingUsers,
  count: state.userReducers.count
});

const mapDispatchToProps = dispatch => ({
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AllUsers);
