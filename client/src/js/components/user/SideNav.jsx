import React from 'react';
import { Link } from 'react-router-dom';

const SideNav = () =>
  (
    <div>
      <ul id="slide-out" className="side-nav">
        <li>
          <Link to="/dashboard/userdocuments"> My Documents </Link>
        </li>
        <li>
          <Link to="/dashboard/new-document"> New Document </Link>
        </li>
        <li>
          <Link to="/dashboard/userdocuments"> Search Documents </Link>
        </li>
      </ul>
      <a href="#name" data-activates="slide-out" className="button-collapse">
        <i className="material-icons">menu</i>
      </a>
    </div>
  );

export default SideNav;

