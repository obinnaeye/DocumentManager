/* global Materialize */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as SigninActions from '../../actions/SigninActions';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
    this.submit = this.submit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  submit() {
    const user = this.state.user;
    const { password, email } = user;
    if (!password || !email) {
      Materialize.toast('Please fill on all form fields!', 5000, 'red');
    } else {
      this.props.SigninActions.signinUser(this.state.user)
        .then(() => {
          this.props.history.push('user/dashboard');
        });
    }
  }

  onChange(e) {
    const ref = e.target;
    const inputId = ref.id;
    const value = ref.value;
    const user = this.state.user;
    user[inputId] = value;
    this.setState({
      user
    });
  }
  render() {
    return (<div className="container">
      <div className="row">
        <h3>Signin Here:</h3>
        <form className="col s12" action="#" onSubmit={this.submit}>
          <div className="row">
            <div className="input-field col s12">
              <input
                onChange={this.onChange}
                id="email"
                type="email"
                className="validate"
                required=""
                aria-required="true"
              />
              <label
                htmlFor="email"
                data-error="wrong"
                data-success="ok"
              >
                Email: (user@domain.com)
              </label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                onChange={this.onChange}
                id="password"
                type="password"
                className="validate"
                required=""
                aria-required="true"
              />
              <label htmlFor="password">
                Password: (Not less than 8 characters)
              </label>
            </div>
          </div>
          <div className="row">
            <input
              className="waves-effect waves-light btn"
              value="Signin"
              type="submit"
            />
            New User?
            <Link
              className="waves-effect waves-light btn"
              to="/signup"
            >
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>);
  }
}

const mapStateToProps = state => ({
  user: state.signInReducer.user
});



const mapDispatchToProps = dispatch => ({
  SigninActions: bindActionCreators(SigninActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Signin);

// export default Signup;
