import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UserActions from '../actions/UserActions';



export default (ComposedConmponent) => {
  class Authenticate extends React.Component {

    componentWillMount() {
      if (!this.props.authenticated && !this.props.signingIn) {
        const { userId } = jwt_decode(localStorage.xsrf_token);
        this.props.UserActions.validateUser(userId)
          .then(() => {
            console.log(this.props.authenticated);
          })
          .catch((error) => {
            this.context.router.history.push('/');
          });
      }
    }

    componentWillReceiveProps(nextProps) {
      if (!nextProps.authenticated && !nextProps.signingIn) {
        this.context.router.history.push('/');
      }
    }

    render() {
      return (
        <ComposedConmponent />
      );
    }
  }

  Authenticate.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    signingIn: PropTypes.bool.isRequired
  };

  Authenticate.contextTypes = {
    router: PropTypes.object.isRequired
  };

  const mapStateToProps = state => ({
    authenticated: state.userReducers.authenticated,
    signingIn: state.signInReducer.signingIn
  });

  const mapDispatchToProps = dispatch => ({
    UserActions: bindActionCreators(UserActions, dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Authenticate);
};

