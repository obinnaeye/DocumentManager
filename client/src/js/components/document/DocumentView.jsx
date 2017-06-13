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

    this.deleteDocument = this.deleteDocument.bind(this);
    this.editDocument = this.editDocument.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.DocumentActions.getDocument(id);
  }

  componentWillReceiveProps(nextProps) {
    const { title, id, content } = nextProps.documents;
    this.setState({
      title,
      id,
      content
    });
  }

  editDocument(e) {
    e.preventDefault();
    const id = e.target.getAttribute('name');
    this.props.history.push(`/dashboard/edit-document/${id}`);
  }

  deleteDocument(e) {
    e.preventDefault();
    const id = e.target.getAttribute('name');
    this.props.DocumentActions.deleteDocument(id)
      .then(() => {
        this.props.history.push('/dashboard/my-documents')
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
              <button onClick={this.editDocument} name={this.state.id} >Edit Document</button>
              <button onClick={this.deleteDocument} name={this.state.id} >Delete Document</button>
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
