import React, { PropTypes } from 'react';
import Pagination from 'react-paginate';

const PlainAllUsers = ({
  offset,
  limit,
  inputChange,
  users,
  renderedUsers,
  pageNavigation,
  pagecount,
  initialPage
}) => (
  <div className="container width-85">
    <div className="row">
      <div className="col s12 m10 offset-m1">
        <p className="col s12 center-align white"> <strong>
        All Users</strong> </p>
        <div className="row white my-top-margin">
          <div className="col s4 m2 offset-m2 white">
            <p>Pagination Tools:</p> </div>
          <div className="input-field col m3 s4 white">
            <input
              id="limit"
              type="number"
              className="validate"
              value={limit}
              onChange={inputChange}
            />
            <label htmlFor="limit" className="active"> List limit </label>
          </div>
          <div className="input-field col m3 s4 white">
            <input
              id="offset"
              type="number"
              className="validate"
              value={offset}
              onChange={inputChange}
            />
            <label htmlFor="offset" className="active"> List offset </label>
          </div>
        </div>
        { users.length > 0 ?
          <div className=" scroll-a row col s12">
            <ul className="collapsible" data-collapsible="accordion">
              {renderedUsers()}
            </ul>
            <div className="row">
              <div className="col s10 offset-s1">
                <Pagination
                  className="col s2 offset-s1"
                  initialPage={initialPage}
                  previousLabel={'previous'}
                  nextLabel={'next'}
                  breakLabel={<a href="">...</a>}
                  breakClassName={'break-me'}
                  pageCount={pagecount}
                  onPageChange={pageNavigation}
                  disableInitialCallback
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </div>
            </div>
          </div>
            :
          <div className="row">
            <div className="col offset-m3 s12 m6">
              <p className="white center-align">
                No Users found, Try with different offset or limit!</p>
              <img
                className="empty"
                src="/public/img/empty.jpg"
                alt="No User found"
              />
            </div>
          </div>
        }
      </div>
    </div>
  </div>
);

PlainAllUsers.propTypes = {
  limit: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  inputChange: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  renderedUsers: PropTypes.func.isRequired,
  pageNavigation: PropTypes.func.isRequired,
  pagecount: PropTypes.number.isRequired,
  initialPage: PropTypes.number.isRequired
};

export default PlainAllUsers;
