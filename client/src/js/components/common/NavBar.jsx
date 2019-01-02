/* global jwt_decode $ */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UserActions from '../../actions/UserActions';
import '../../../../public/style/main.scss';
import PlainNavBar from './PlainNavBar';

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
      authenticated: false,
      signingIn: false,
      createdUser: false,
      count: 0
    };
    this.logout = this.logout.bind(this);
  }

  /**
   * @returns {void}
   * @memberOf NavBar
   */
  componentDidMount() {
    if (localStorage.accessToken) {
      const { userId } = jwt_decode(localStorage.accessToken);
      this.props.UserActions.validateUser(userId);
    }
  }

  /**
   * @param {objcet} nextProps
   * @memberOf NavBar
   * @returns {void}
   */
  componentWillReceiveProps(nextProps) {
    const { authenticated, signingIn, createdUser, count } = nextProps;
    this.setState({
      authenticated,
      signingIn,
      createdUser,
      count
    });

    if (authenticated || signingIn || createdUser) {
      // initialize collapse button here, so it does not conflict with
      // sidenav of dashboard when authenticated
      const dashboard = /dashboard/;
      const location = window.location.hash;
      if (!location.match(dashboard)) {
        $('.button-collapse').sideNav({
          menuWidth: 'auto',
          edge: 'left',
          closeOnClick: true,
          draggable: true
        }
      );
      }
      return;
    }
    // initialize collapse button here, so it does not conflict with
    // sidenav of dashboard when authenticated
    $('.button-collapse').sideNav({
      menuWidth: 'auto',
      edge: 'left',
      closeOnClick: true,
      draggable: true
    });
  }

  /**
   * @desc Sends a logout call to server and redirects to home
   * @memberOf NavBar
   * @returns {void}
   */
  logout() {
    this.props.UserActions.logout();
  }

  /**
   * @desc Renders a component on the DOM
   * @returns {element} -DOM element - header
   * @memberOf NavBar
   */
  render() {
    return (
      <PlainNavBar
        authenticated={this.state.authenticated}
        createdUser={this.state.createdUser}
        signingIn={this.state.signingIn}
        logout={this.logout}
      />
    );
  }
}

NavBar.defaultProps = {
  authenticated: false
};

NavBar.propTypes = {
  UserActions: PropTypes.object.isRequired,
  authenticated: PropTypes.bool,
  signingIn: PropTypes.bool.isRequired,
  createdUser: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.userReducers.authenticated,
  signingIn: state.userReducers.signingIn,
  createdUser: state.userReducers.createdUser,
  count: state.userReducers.count
});

const mapDispatchToProps = dispatch => ({
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
