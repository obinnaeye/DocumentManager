import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';

class DocumentView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      id: '',
      title: '',
      content: ''
    };
  }

  componentDidMount() {
    const match = this.props.match.params.id;
    this.props.DocumentActions.getDocument(match);
  }

  componentWillReceiveProps(nextProps) {
    const { title, id, content } = nextProps.documents;
    this.setState({
      title,
      id,
      content
    });
  }

  render() {
    const parsedContent = <div dangerouslySetInnerHTML={{ __html: this.state.content }} />;
    return (
      <div className="row">
        <div className="col s12 m12">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">{this.state.title}</span>
              <div>{parsedContent}</div>
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

const mapStateToProps = state => ({
  documents: state.documentReducer.documents
});



const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView);
