import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UserActions from '../../actions/UserActions';
import '../../../../public/style/main.scss';

class NavBar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      authenticated: false
    };
    this.navigationButtons = this.navigationButtons.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const { userId } = jwt_decode(localStorage.xsrf_token);
    this.props.UserActions.validateUser(userId);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.authenticated);
  }

  navigationButtons() {
    const authenticated = this.props.authenticated;
    const signingIn = this.props.signingIn;
    if (authenticated || signingIn) {
      return (
      [
        <li key="dashboard"><Link to="/dashboard/my-documents" >Dashboard</Link></li>,
        <li key="auth"><Link to="/" onClick={this.logout}>Logout</Link></li>
      ]
      );
    }
    return (
    [
      <li key="dashboard"><Link to="/signin">Signin</Link></li>,
      <li key="auth"><Link to="/signup" replace>Signup</Link></li>
    ]
    );
  }

  logout() {
    this.props.UserActions.logout()
      .then(() => {
        this.props.history.push('/');
      });
  }

  render() {
    return (
      <header>
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper"><a className="brand-logo">okDocs</a>
              <a data-activates="mobile-demo" className="button-collapse">
                <i className="material-icons">menu</i>
              </a>
              <ul className="right hide-on-med-and-down">
                {this.navigationButtons()}
              </ul>
            </div>
          </nav>
        </div>
        <ul className="side-nav" id="mobile-demo">
          {this.navigationButtons()}
        </ul>
      </header>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.userReducers.authenticated,
  signingIn: state.signInReducer.signingIn
});

const mapDispatchToProps = dispatch => ({
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
