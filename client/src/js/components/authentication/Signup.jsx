/* global Materialize */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SignupActions from '../../actions/SignupActions';

class Signup extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {}
    };
    this.submit = this.submit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  submit() {
    const user = this.state.user;
    const { firstName, lastName, password, email } = user;
    if (!firstName || !lastName || !password || !email) {
      Materialize.toast('Please fill on all form fields!', 5000, 'red');
    } else {
      this.props.SignupActions.createUser(this.state.user);
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
        <h3>Signup Here:</h3>
        <form className="col s12" action="#" onSubmit={this.submit}>
          <div className="row">
            <div className="input-field col s6">
              <input
                onChange={this.onChange}
                id="firstName"
                type="text"
                className="validate"
              />
              <label
                htmlFor="firstName"
                data-error="wrong"
                data-success="right"
              >
              First Name
              </label>
            </div>
            <div className="input-field col s6">
              <input
                onChange={this.onChange}
                id="lastName"
                type="text"
                className="validate"
              />
              <label htmlFor="lastName">Last Name</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                onChange={this.onChange}
                id="email"
                type="email"
                className="validate"
              />
              <label htmlFor="email">Email: (user@domain.com)</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                onChange={this.onChange}
                id="password"
                type="password"
                className="validate"
              />
              <label htmlFor="password">
                Password: (Not less than 8 characters)
              </label>
            </div>
          </div>
          <div className="row">
            <input
              className="waves-effect waves-light btn"
              value="Signup"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>);
  }
}

const mapStateToProps = state => ({
  user: state.user
});



const mapDispatchToProps = dispatch => ({
  SignupActions: bindActionCreators(SignupActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

// export default Signup;
