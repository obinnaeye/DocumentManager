/* global jwt_decode */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UserActions from '../actions/UserActions';
import Signin from '../components/authentication/Signin';

export default (ComposedConmponent) => {
  /**
   * @class Authenticate
   * @extends {React.Component}
   */
  class Authenticate extends React.Component {
    /**
     * @memberOf Authenticate
     * @returns {void}
     */
    componentDidMount() {
      if (!this.props.authenticated && !this.props.signingIn) {
        const { userId } = jwt_decode(localStorage.xsrf_token);
        this.props.UserActions.validateUser(userId);
      }
    }

    /**
     * @returns {element} DOM element ComposedConmponent
     * @memberOf Authenticate
     */
    render() {
      return (
        <span>
          { this.props.authenticated || this.props.signingIn
             ? <ComposedConmponent {...this.props} /> : <Signin />}
        </span>
      );
    }
  }

  Authenticate.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    signingIn: PropTypes.bool.isRequired,
    UserActions: PropTypes.object.isRequired
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

