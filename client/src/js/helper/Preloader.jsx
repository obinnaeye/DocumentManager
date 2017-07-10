import React from 'react';

const Preloader =
(count, condition, signinComponent, authenticatedComponent) => {
  if (count !== 0) {
    if (condition) {
      return signinComponent;
    }
    return authenticatedComponent;
  }
  if (!localStorage.xsrf_token) {
    return signinComponent;
  }
  return (
    <div className="progress">
      <div className="indeterminate" />
    </div>
  );
};

export default Preloader;
