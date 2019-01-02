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
      limit: 10,
      start: 0
    };

    this.renderedUsers = this.renderedUsers.bind(this);
    this.editUser = this.editUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.pageNavigation = this.pageNavigation.bind(this);
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
      const allUsers = nextProps.users;
      const totalUsers = allUsers.length;
      const pagecount = totalUsers / 10;
      let { start } = this.state;
      let target;
      let users = allUsers.slice(start, start + 10);
      let length;
      if (this.state.target) {
        this.state.target.classList.remove('active');
      }
      if (start > 0 && totalUsers <= start) {
        start = ((start / 10) - 1) * 10;
        users = allUsers.slice(start, start + 10);
        const parent = document.getElementsByClassName('pagination');
        length = parent[0].children.length;
        target = parent[0].children[length - 3];
        if (length === 3) {
          target = parent[0].children[length - 2];
        }
      }
      this.setState({
        allUsers,
        users,
        fetchingUsers: nextProps.fetchingUsers,
        count: nextProps.count,
        pagecount,
        totalUsers,
        target
      }, () => {
        if (target && length >= 4) {
          target.classList.add('active');
          target.click();
        }
      });
    }
  }

  /**
   * @return {void} Returns void
   * @memberOf AllUsers
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
   * @param {object} event - triggered event
   * @memberOf AllUsers
   * @returns {void}
   */
  editUser(event) {
    event.preventDefault();
    const id = event.target.getAttribute('name');
    this.props.history.push(`/dashboard/edit-user/${id}`);
  }

  /**
   * @desc Delets a docuement and redirects to users page
   * @param {object} event - triggered event
   * @memberOf AllUsers
   * @returns {void}
   */
  deleteUser(event) {
    event.preventDefault();
    const id = event.target.getAttribute('name');
    this.props.UserActions.deleteUser(id);
  }

  /**
   * @desc - Method that handles change events
   * @param {objcet} event - triggered event
   * @return {void} - Returns void
   * @memberOf AllUsers
   */
  inputChange(event) {
    event.preventDefault();
    const value = event.target.value;
    const name = event.target.getAttribute('id');
    if (value < 1 && name === 'limit') {
      Materialize.toast(`${name} can not be 0`, 3000, 'red');
    } else if (value < 0 && name === 'offset') {
      Materialize.toast(`${name} can not be negative`, 3000, 'red');
    } else {
      this.setState({
        [name]: value
      }, this.getUsers);
    }
  }

  /**
   * @desc Navigates to next/previous users list
   * @returns {void} - returns void
   * @param {object} event - target DOM element
   * @memberOf AllUsers
   */
  pageNavigation(event) {
    const selected = event.selected;
    const start = selected * 10;
    const users = this.state.allUsers.slice(start, start + 10);
    this.setState({ users, start, selected });
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
        const { firstName, lastName, userId } = user;
        return (
          <UserCollapsible
            key={userId}
            roleId={roleId}
            firstName={firstName}
            lastName={lastName}
            role={user.roleId === 1 ? 'Admin' : 'Regular'}
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
        pageNavigation={this.pageNavigation}
        pagecount={this.state.pagecount}
        initialPage={this.state.initialPage}
        forcePage={this.state.forcePage}
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
