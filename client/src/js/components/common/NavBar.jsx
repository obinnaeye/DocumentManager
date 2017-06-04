// import React from 'react';

// const NavBar = () =>
//   (<nav>
//     <h4>Home</h4>
//     <h4>Dashboard</h4>
//     <h4>Others</h4>
//   </nav>);

// export default NavBar;

import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () =>
  (<div>
    <ul>
      <li><Link to="dashboard">App</Link></li>
      <li><Link to="login">Login</Link></li>
    </ul>
  </div>
  );

export default NavBar;
