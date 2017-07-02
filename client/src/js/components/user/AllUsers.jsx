/* global $ Materialize */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UserActions from '../../actions/UserActions';

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
        fetchingUsers: nextProps.fetchingUsers
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
          <li key={userId}>
            <div className="collapsible-header">
              <i className="material-icons orange">person</i>
              <span><b>First Name: </b>
                <em>{firstName}</em></span>
            </div>
            <div className="collapsible-body white">
              <span> <b>FirstName:</b> {firstName} </span><br />
              <span> <b>LastName:</b> {lastName} </span><br />
              <span> <b>Email:</b> {email} </span><br />
              { roleId === 2 ?
                <span className="right">
                  <a
                    className="my-zindex-high button-margin"
                    onClick={this.editUser}
                    name={userId}
                  >
                    <i
                      className="material-icons"
                      name={userId}
                    >mode_edit</i></a>
                  <a
                    className="my-danger lighten-2 my-zindex-high button-margin"
                    onClick={this.deleteUser}
                    name={userId}
                  >
                    <i
                      className="material-icons"
                      name={userId}
                    >delete</i></a>
                </span> : ''}
            </div>
          </li>);
      });
      return render;
    }
  }

  /**
   * @returns {element} DOM element div
   * @memberOf AllUsers
   */
  render() {
    const users = this.props.users;

    return (
      <div className="container width-85">
        <div className="row">
          <div className="col s12 m10 offset-m1">
            <p className="col s12 center-align white"> <strong>
            All Users</strong> </p>
            <div className="row white my-top-margin">
              <div className="col s4 m2 offset-m2 white">
                <p>Pagination Tools:</p> </div>
              <div className="input-field col m3 s4 white">
                <input
                  id="limit"
                  type="number"
                  className="validate"
                  value={this.state.limit}
                  onChange={this.inputChange}
                />
                <label htmlFor="limit" className="active"> List limit </label>
              </div>
              <div className="input-field col m3 s4 white">
                <input
                  id="offset"
                  type="number"
                  className="validate"
                  value={this.state.offset}
                  onChange={this.inputChange}
                />
                <label htmlFor="offset" className="active"> List offset </label>
              </div>
            </div>
            { users.length > 0 ?
              <div className=" scroll-a row col s12">
                <ul className="collapsible" data-collapsible="accordion">
                  {this.renderedUsers()}
                </ul>
              </div>
                :
              <div className="row">
                <div className="col offset-m3 s12 m6">
                  <p className="white center-align">
                    No Users found, Try with different offset or limit!</p>
                  <img
                    className="empty"
                    src="/public/img/empty.jpg"
                    alt="No User found"
                  />
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

AllUsers.propTypes = {
  users: PropTypes.array.isRequired,
  UserActions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchingUsers: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  users: state.userReducers.users,
  fetchingUsers: state.userReducers.fetchingUsers
});

const mapDispatchToProps = dispatch => ({
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AllUsers);
