import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DocumentActions from '../../actions/DocumentActions';

/**
 * @class DocumentView
 * @extends {React.Component}
 */
class DocumentView extends React.Component {

  /**
   * Creates an instance of DocumentView.
   * @param {any} props
   * @param {any} context
   * @memberOf DocumentView
   */
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

  /**
   * @memberOf DocumentView
   * @returns {void}
   */
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.DocumentActions.getDocument(id);
  }

  /**
   * @param {objcet} nextProps
   * @memberOf DocumentView
   * @returns {void}
   */
  componentWillReceiveProps(nextProps) {
    const { title, id, content } = nextProps.documents;
    this.setState({
      title,
      id,
      content
    });
  }

  /**
   * @desc Redirects to edit page using document id
   * @param {object} e
   * @memberOf DocumentView
   * @returns {void}
   */
  editDocument(e) {
    e.preventDefault();
    const id = e.target.getAttribute('name');
    this.props.history.push(`/dashboard/edit-document/${id}`);
  }

  /**
   * @desc Delets a docuement and redirects to documents page
   * @param {object} e
   * @memberOf DocumentView
   * @returns {void}
   */
  deleteDocument(e) {
    e.preventDefault();
    const id = e.target.getAttribute('name');
    this.props.DocumentActions.deleteDocument(id)
      .then(() => {
        this.props.history.push('/dashboard/my-documents');
      });
  }

  /**
   * @returns {element} DOM element - div
   * @memberOf DocumentView
   */
  render() {
    const parsedContent = (<div
      dangerouslySetInnerHTML={{ __html: this.state.content }}
    />);
    return (
      <div className="container row">
        <div className="col s12 m12">
          <div className="card white darken-1">
            <div className="card-content black-text">
              <span className="card-title">
                <strong>{this.state.title}</strong></span>
              <div>{parsedContent}</div>
            </div>
            <div className="card-action">
              <button
                className="btn orange button-margin"
                onClick={this.editDocument}
                name={this.state.id}
              >
                <i
                  className="material-icons"
                  name={this.state.id}
                >mode_edit</i></button>
              <button
                className=" btn red lighten-2 button-margin"
                onClick={this.deleteDocument}
                name={this.state.id}
              >
                <i
                  className="material-icons"
                  name={this.state.id}
                >delete</i></button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DocumentView.propTypes = {
  match: PropTypes.object.isRequired,
  DocumentActions: PropTypes.func.isRequired,
  documents: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  documents: state.documentReducer.documents
});

const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView);
