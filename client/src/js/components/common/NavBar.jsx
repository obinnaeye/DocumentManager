/* global jwt_decode $ */
import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UserActions from '../../actions/UserActions';
import '../../../../public/style/main.scss';

/**
 * @class NavBar
 * @extends {React.Component}
 */
class NavBar extends React.Component {

  /**
   * Creates an instance of NavBar.
   * @param {object} props
   * @param {object} context
   * @memberOf NavBar
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      authenticated: false
    };
    this.navigationButtons = this.navigationButtons.bind(this);
    this.logout = this.logout.bind(this);
  }

  /**
   * @returns {void}
   * @memberOf NavBar
   */
  componentDidMount() {
    const { userId } = jwt_decode(localStorage.xsrf_token);
    this.props.UserActions.validateUser(userId);
  }

  /**
   * @desc Creates nav buttons depending on user logged in or not
   * @returns {object} - DOM eleement
   * @memberOf NavBar
   */
  navigationButtons() {
    const authenticated = this.props.authenticated;
    const signingIn = this.props.signingIn;
    const createdUser = this.props.createdUser;
    if (authenticated || signingIn || createdUser) {
      return (
      [
        <li key="dashboard"><Link to="/dashboard">
        Dashboard</Link></li>,
        <li key="auth"><Link to="/" onClick={this.logout}>Logout</Link></li>
      ]
      );
    }
    // initialize collapse button here, so it does not conflict with
    // sidenav of dashboard when authenticated
    $('.button-collapse').sideNav({
      menuWidth: 'auto',
      edge: 'left',
      closeOnClick: true,
      draggable: true
    });
    return (
    [
      <li key="dashboard"><Link to="/signin">Signin</Link></li>,
      <li key="auth"><Link to="/signup" replace>Signup</Link></li>
    ]
    );
  }

  /**
   * @desc Sends a logout call to server and redirects to home
   * @memberOf NavBar
   * @returns {void}
   */
  logout() {
    this.props.UserActions.logout()
      .then(() => {
        this.props.history.push('/dashboard');
      });
  }

  /**
   * @desc Renders a component on the DOM
   * @returns {element} -DOM element - header
   * @memberOf NavBar
   */
  render() {
    return (
      <header id="header">
        <div className="navbar-fixed black">
          <nav className="grey darken-4">
            <div className="nav-wrapper"><a className="brand-logo">
              <i className="fa fa-thumbs-up" aria-hidden="true" />okDocs</a>
              <a data-activates="mobile-demo" className="button-collapse right">
                <i className="material-icons">menu</i>
              </a>
              <ul className="right hide-on-med-and-down">
                {this.navigationButtons()}
              </ul>
            </div>
          </nav>
        </div>
        <ul className="side-nav" id="mobile-demo">
          {this.navigationButtons()}
        </ul>
      </header>
    );
  }
}

NavBar.defaultProps = {
  authenticated: false
};

NavBar.propTypes = {
  UserActions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  authenticated: PropTypes.bool,
  signingIn: PropTypes.bool.isRequired,
  createdUser: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.userReducers.authenticated,
  signingIn: state.signInReducer.signingIn,
  createdUser: state.signInReducer.createdUser
});

const mapDispatchToProps = dispatch => ({
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
