import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

const PlainNavBar = ({
  authenticated,
  signingIn,
  createdUser,
  logout
}) => (
  <header id="header">
    <div className="navbar-fixed black">
      <nav className="grey darken-4">
        <div className="nav-wrapper"><a className="brand-logo">
          <i className="fa fa-thumbs-up" aria-hidden="true" />okDocs</a>
          <a data-activates="mobile-demo" className="button-collapse right">
            <i className="material-icons">menu</i>
          </a>
          <ul className="right hide-on-med-and-down">
            {authenticated ||
              signingIn ||
              createdUser ?
            [<li key="dashboard">
              <Link to="/dashboard" id="dashboard">Dashboard</Link>
            </li>,
              <li key="auth">
                <Link to="/" onClick={logout} id="logout">Logout</Link>
              </li>] :
            [
              <li key="dashboard"><Link to="/signin" id="signin">Signin</Link></li>,
              <li key="auth"><Link to="/signup">Signup</Link></li>
            ]}
          </ul>
        </div>
      </nav>
    </div>
    <ul className="side-nav" id="mobile-demo">
      {authenticated ||
        signingIn ||
        createdUser ?
      [<li key="dashboard">
        <Link to="/dashboard" id="dashboard">Dashboard</Link>
      </li>,
        <li key="auth">
          <Link to="/" onClick={logout} id="logout">Logout</Link>
        </li>] :
      [
        <li key="signin"><Link to="/signin">Signin</Link></li>,
        <li key="auth"><Link to="/signup">Signup</Link></li>
      ]}
    </ul>
  </header>
);

PlainNavBar.defaultProps = {
  authenticated: false,
  createdUser: false,
  signingIn: false
};

PlainNavBar.propTypes = {
  authenticated: PropTypes.bool,
  signingIn: PropTypes.bool,
  createdUser: PropTypes.bool,
  logout: PropTypes.func.isRequired
};

export default PlainNavBar;
