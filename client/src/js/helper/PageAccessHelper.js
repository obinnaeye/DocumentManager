/* global jwt_decode */
import React, { PropTypes } from 'react';
//import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UserActions from '../actions/UserActions';

export default (ComposedConmponent) => {
  /**
   * @class Authenticate
   * @extends {React.Component}
   */
  class Authenticate extends React.Component {

    /**
     * Creates an instance of Authenticate.
     * @param {object} props
     * @param {object} context
     * @memberOf Authenticate
     */
    constructor(props, context) {
      super(props, context);
      this.state = {
        authenticated: this.props.authenticated,
        createdUser: this.props.createdUser,
        signingIn: this.props.signingIn
      };
    }

    /**
     * @memberOf Authenticate
     * @returns {void}
     */
    componentDidMount() {
      if (!this.props.authenticated && !this.props.signingIn &&
      !this.props.createdUser) {
        const { userId } = jwt_decode(localStorage.xsrf_token);
        this.props.UserActions.validateUser(userId);
      }
    }

    /**
   * @param {object} nextProps - Next props received
   * @return {void} - Returns void
   * @memberOf Authenticate
   */
    componentWillReceiveProps(nextProps) {
      const { authenticated, signingIn, createdUser } = nextProps;
      if (authenticated || signingIn || createdUser) {
        this.setState({
          authenticated: nextProps.authenticated,
          createdUser: nextProps.createdUser,
          signingIn: nextProps.signingIn
        });
      }
    }

    /**
     * @returns {element} DOM element ComposedConmponent
     * @memberOf Authenticate
     */
    render() {
      return (
        <span>
          { this.state.authenticated || this.state.signingIn
            || this.state.createdUser
             ? <ComposedConmponent {...this.props} /> :
             ''}
        </span>
      );
    }
  }

  Authenticate.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    signingIn: PropTypes.bool.isRequired,
    UserActions: PropTypes.object.isRequired,
    createdUser: PropTypes.bool.isRequired
  };

  Authenticate.contextTypes = {
    router: PropTypes.object.isRequired
  };

  const mapStateToProps = state => ({
    authenticated: state.userReducers.authenticated,
    signingIn: state.signInReducer.signingIn,
    createdUser: state.signUpReducer.createdUser
  });

  const mapDispatchToProps = dispatch => ({
    UserActions: bindActionCreators(UserActions, dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Authenticate);
};

