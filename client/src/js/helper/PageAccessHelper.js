/* global jwt_decode */
import React, { PropTypes } from 'react';
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
     * @param {any} props
     * @param {any} context
     * @memberOf Authenticate
     */
    constructor(props, context) {
      super(props, context);
      this.state = {
        callcount: 0
      };
    }

    /**
     * @memberOf Authenticate
     * @returns {void}
     */
    componentWillMount() {
      if (!this.props.authenticated && !this.props.signingIn) {
        const { userId } = jwt_decode(localStorage.xsrf_token);
        this.props.UserActions.validateUser(userId);
      }
    }

    /**
     * @param {object} nextProps
     * @returns {void}
     * @memberOf Authenticate
     */
    componentWillReceiveProps(nextProps) {
      if (!nextProps.authenticated && !nextProps.signingIn) {
        if (this.state.callcount > 0) {
          this.context.router.history.push('/');
        } else {
          const { userId } = jwt_decode(localStorage.xsrf_token);
          this.props.UserActions.validateUser(userId);
          this.setState({
            callcount: this.state.callcount + 1
          });
        }
      }
    }

    /**
     * @returns {element} DOM element ComposedConmponent
     * @memberOf Authenticate
     */
    render() {
      return (
        <ComposedConmponent {...this.props} />
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

