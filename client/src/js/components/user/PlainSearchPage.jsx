import React, { PropTypes } from 'react';

const PlainSearchPage = ({
  offset,
  limit,
  inputChange,
  combinedRendered,
  search,
}) => (
  <div className="container">
    <div className="my-centered white">
      <div className="white" >
        <div className="row">
          <h5 className="col s6 m2"> Search for: </h5>
          <select
            id="searchSelect"
            className="col s4 m3"
          >
            <option value="documents">Document</option>
            <option value="users">User</option>
          </select>
        </div>
        <div className="row my-top-border">
          <div className="input-field col m6 s4">
            <input id="search" type="text" className="validate" />
            <label htmlFor="search">Search</label>
          </div>
          <div className="input-field col m3 s4">
            <input
              id="limit"
              type="number"
              className="validate"
              value={limit}
              onChange={inputChange}
            />
            <label htmlFor="limit" className="active">Search limit</label>
          </div>
          <div className="input-field col m3 s4">
            <input
              id="offset"
              type="number"
              className="validate"
              value={offset}
              onChange={inputChange}
            />
            <label htmlFor="offset" className="active">Search offset</label>
          </div>
        </div>
      </div>
      <div className="row">
        <button
          id="searchButton"
          className="btn orange col m2 s12"
          onClick={search}
        >
        Search </button>
      </div>
      <div className=" scroll-a row col s12">
        <ul className="collapsible" data-collapsible="accordion">
          {combinedRendered()}
        </ul>
      </div>
    </div>
  </div>
);

PlainSearchPage.propTypes = {
  limit: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  inputChange: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  combinedRendered: PropTypes.func.isRequired
};

export default PlainSearchPage;
