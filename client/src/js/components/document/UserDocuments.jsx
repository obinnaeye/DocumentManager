/* global jwt_decode */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Coverflow from 'react-coverflow';
import * as DocumentActions from '../../actions/DocumentActions';
import '../../../../public/style/main.scss';

/**
 * @class UserDocuments
 * @extends {React.Component}
 */
class UserDocuments extends React.Component {

  /**
   * Creates an instance of UserDocuments.
   * @param {object} props
   * @param {object} context
   * @returns {void}
   * @memberOf UserDocuments
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      title: '',
      content: '',
      documents: this.props.userDocuments
    };

    this.viewCarousel = this.viewCarousel.bind(this);
  }

  /**
   * @memberOf UserDocuments
   * @returns {void}
   */
  componentDidMount() {
    const { userId } = jwt_decode(localStorage.xsrf_token);
    this.props.DocumentActions.getUserDocuments(userId);
  }

  /**
   * @param {object} nextProps
   * @returns {void}
   * @memberOf UserDocuments
   */
  componentWillReceiveProps(nextProps) {
    const { title, content } = nextProps.userDocuments[0];
    this.setState({
      title,
      content,
      documents: nextProps.userDocuments
    });
  }

  /**
   * @desc Opens a single document
   * @param {object} e
   * @returns {void}
   * @memberOf UserDocuments
   */
  viewCarousel(e) {
    const id = e.target.getAttribute('name');
    this.props.history.push(`/dashboard/documents/${id}`);
  }

  /**
   * @returns {element} DOM element div
   * @memberOf UserDocuments
   */
  render() {
    const documents = this.props.userDocuments;
    let formatedDocuments;
    if (documents.length > 0) {
      formatedDocuments = documents.map((myDocument) => {
        const { id, title, content } = myDocument;
        // convert string to html
        const formatedContent =
          <div dangerouslySetInnerHTML={{ __html: content }} />;
        return (
          <div key={id} className="myCover" >
            <button
              className="btn open-doc"
              onClick={this.viewCarousel}
              name={id}
            >Open</button>
            <h3>{title}</h3>
            {formatedContent}
          </div>
        );
      });
    }

    return (
      <Coverflow
        style={{ height: '1000px', color: 'red' }}
        width={'auto'}
        height={500}
        displayQuantityOfSide={3}
        navigation
        enableHeading={false}
      >
        {formatedDocuments}
      </Coverflow>
    );
  }
}

UserDocuments.propTypes = {
  userDocuments: PropTypes.array.isRequired,
  DocumentActions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  userDocuments: state.documentReducer.userDocuments
});

const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDocuments);
