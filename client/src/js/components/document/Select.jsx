import React, { PropTypes } from 'react';

const Select = props =>
  (
    <div className="input-field col s6">
      <select
        className="browser-default"
        onChange={props.onChange}
        id="access"
        value={props.value}
      >
        <option value="private">Private</option>
        <option value="public">Public</option>
        <option value="writer">Role</option>
      </select>
    </div>
  );

Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default Select;
