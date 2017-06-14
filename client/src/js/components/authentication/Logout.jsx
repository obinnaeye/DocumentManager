import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LogoutActions from '../../actions/LogoutActions';

class Logout extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  onClick() {
    localStorage.removeItem('xsrf_token');
    this.props.history.push('/');
  }

  render() {
    return (
      <div></div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.singoutReducer
});

const mapDispatchToProps = dispatch => ({
  LogoutActions: bindActionCreators(LogoutActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
