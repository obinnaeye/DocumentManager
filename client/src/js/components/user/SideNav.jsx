/* global $ */
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @class SideNav
 * @extends {React.Component}
 */
class SideNav extends React.Component {

  /**
   * @memberOf SideNav
   * @returns {void}
   */
  componentDidMount() {
    $('.button-collapse').sideNav({
      menuWidth: 'auto',
      edge: 'left',
      closeOnClick: true,
      draggable: true
    }
    );
  }

  /**
   * @returns {element} DOM element - div
   * @memberOf SideNav
   */
  render() {
    return (
      <div>
        <ul id="slide-out" className="side-nav">
          <li>
            <Link to="/dashboard/my-documents" > My Documents </Link>
          </li>
          <li>
            <Link to="/dashboard/new-document" > New Document </Link>
          </li>
          <li>
            <Link to="/dashboard/search" > Search Documents </Link>
          </li>
          <li>
            <Link to="/dashboard/edit-profile" > Edit Profile </Link>
          </li>
        </ul>
        <a
          href="#slide-out"
          data-activates="slide-out"
          className="button-collapse"
        >
          <i className="material-icons">menu</i>
        </a>
      </div>
    );
  }
}

export default SideNav;

