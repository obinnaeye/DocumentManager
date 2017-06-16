import React, { PropTypes } from 'react';

const Select = props =>
  (
    <div>
      <a
        className="dropdown-button input-field col s5 center-align"
        data-beloworigin="true"
        data-activates="dropdown1"
      >{props.access}
      </a>
      <ul id="dropdown1" className="dropdown-content">
        <li id="Private" onClick={props.onClick}>Private</li>
        <li id="Public" onClick={props.onClick}>Public</li>
        <li id="Role" onClick={props.onClick}>Role</li>
      </ul>
    </div>
  );

Select.propTypes = {
  access: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Select;
