import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentCarousel from './DocumentCarousel';
import * as DocumentActions from '../../actions/DocumentActions';

class UserDocuments extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      title: '',
      content: '',
      documents: this.props.userDocuments
    };

    this.viewCarousel = this.viewCarousel;
  }

  componentWillReceiveProps(nextProps) {
    const { title, content } = nextProps.userDocuments[0];
    this.setState({
      title,
      content,
      documents: nextProps.userDocuments
    });
  }

  componentDidMount() {
    this.props.DocumentActions.getUserDocuments();
  }

  viewCarousel(e) {
    console.log(e.target);
  }

  render() {
    return (
      <div>
        <DocumentCarousel
          title={this.state.title}
          content={this.state.content}
          viewCarousel={this.openCarousel}
        />
        <div id="modal1" className="modal modal-fixed-footer">
          <div className="modal-content">
            <h4>Modal Header</h4>
            <p>A bunch of text</p>
          </div>
          <div className="modal-footer">
            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat ">Agree</a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userDocuments: state.documentReducer.userDocuments
});



const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDocuments);
