import React from 'react';

const Preloader =
(count, condition, authComponent, authenticatedComponent) => {
  if (count !== 0) {
    if (condition) {
      return authComponent;
    }
    return authenticatedComponent;
  }
  if (!localStorage.accessToken) {
    return authComponent;
  }
  return (
    <div className="progress">
      <div className="indeterminate" />
    </div>
  );
};

export default Preloader;
