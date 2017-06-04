import React from 'react';

const Dashboard = ({ match }) => {
  console.log(match.url, 'param', match.params);
  return <div> This is Dashboard </div>;
};

export default Dashboard;
