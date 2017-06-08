import React from 'react';

class Logout extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  onClick() {
    localStorage.removeItem('xsrf_token');
    this.props.history.push('/');
  }
}