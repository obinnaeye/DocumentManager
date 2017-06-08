import React from 'react';

class DocumentView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      title: '',
      content: '',
      accessType: ''
    };
  }

  render() {
    return (
      <div className="row">
        <div className="col s12 m6">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">{this.state.title}</span>
              <div>{this.state.content}</div>
            </div>
            <div className="card-action">
              <button onClick={this.editDocument}>Edit Document</button>
              <button onClick={this.deleteDocument}>Delete Document</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
