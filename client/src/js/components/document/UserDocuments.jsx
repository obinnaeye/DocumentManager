import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Coverflow from 'react-coverflow';
import * as DocumentActions from '../../actions/DocumentActions';
import '../../../../public/style/main.scss';

class UserDocuments extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      title: '',
      content: '',
      documents: this.props.userDocuments
    };

    this.viewCarousel = this.viewCarousel.bind(this);
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
    const id = e.target.getAttribute('name');
    this.props.history.push(`/dashboard/documents/${id}`);
  }

  render() {
    const documents = this.props.userDocuments;
    let formatedDocuments;
    if (documents.length > 0) {
      formatedDocuments = documents.map((myDocument) => {
        const { id, title, content } = myDocument;
        // convert string to html
        const formatedContent = <div dangerouslySetInnerHTML={{ __html: content }} />;
        return (
          <div key={id} className="myCover" >
            <button className="btn open-doc" onClick={this.viewCarousel} name={id}>Open</button>
            <h3>{title}</h3>
            {formatedContent}
          </div>
        );
      });
    }

    return (
      <div>
        <Coverflow
          style={{ height: '1000px', color: 'red' }}
          width={'auto'}
          height={500}
          displayQuantityOfSide={3}
          navigation
          enableHeading={false}
        >
          {formatedDocuments}
        </Coverflow>)
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
