import React from 'react';

class Signup extends React.Component {
  submit(){
    console.log("subimit");
  }
  render() {
    return (<div className="container">
      <div className="row">
        <h3>Signup Here:</h3>
        <form className="col s12" onSubmit={this.submit} >
          <div className="row">
            <div className="input-field col s6">
              <input
                id="first_name"
                type="text"
                className="validate"
              />
              <label htmlFor="first_name">First Name</label>
            </div>
            <div className="input-field col s6">
              <input
                id="last_name"
                type="text"
                className="validate"
              />
              <label htmlFor="last_name">Last Name</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input id="email" type="email" className="validate" />
              <label htmlFor="email">Email: (user@domain.com)</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input id="password" type="password" className="validate" />
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

export default Signup;
