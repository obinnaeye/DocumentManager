import React from 'react';

const Preloader = (count, condition, component1, component2) => {
  if (count !== 0) {
    if (condition) {
      return component1;
    }
    return component2;
  }
  return (
    <div className="progress">
      <div className="indeterminate" />
    </div>
  );
};

export default Preloader;
