import React from 'react';
import { Link } from 'react-router-dom';
import '../../../../public/style/main.scss';

const NavBar = () =>
  (
    <header>
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper"><a className="brand-logo">okDocs</a>
            <a data-activates="mobile-demo" className="button-collapse">
              <i className="material-icons">menu</i>
            </a>
            <ul className="right hide-on-med-and-down">
              <li><Link to="dashboard">Dashboard</Link></li>
              <li><Link to="signup">Signup</Link></li>
              <li><Link to="signin">Signin</Link></li>
            </ul>
          </div>
        </nav>
      </div>
      <ul className="side-nav" id="mobile-demo">
        <li><Link to="signup">Signup</Link></li>
        <li><Link to="signin">Signin</Link></li>
      </ul>
    </header>
  );

export default NavBar;
