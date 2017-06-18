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

    $('#pushpin').pushpin({
      top: 150,
      bottom: 1000,
      offset: 70
    });
  }

  /**
   * @returns {element} DOM element - div
   * @memberOf SideNav
   */
  render() {
    return (
      <div>
        <ul id="slide-out" className="side-nav orange accent-3">
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
          className="button-collapse btn-floating pulse  orange accent-3"
          data-target="slide-out"
          id="pushpin"
        >
          <i className="material-icons">menu</i>
        </a>
      </div>
    );
  }
}

export default SideNav;

