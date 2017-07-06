/* global $ */
import React, { PropTypes } from 'react';
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
      offset: 0
    });
    if (this.props.location.pathname === '/dashboard') {
      $('#pushpin').click();
    }
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
          <li>
            <Link to="/dashboard/all-documents" > All Document </Link>
          </li>
          <li>
            <Link to="/dashboard/all-users" > All Users </Link>
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

SideNav.propTypes = {
  location: PropTypes.object.isRequired
};

export default SideNav;

