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
    if (nextProps.userDocuments.length > 0) {
      const { title, content } = nextProps.userDocuments[0];
      this.setState({
        title,
        content,
        documents: nextProps.userDocuments
      });
    }
  }

  /**
   * @desc Opens a single document
   * @param {object} e
   * @returns {void}
   * @memberOf UserDocuments
   */
  viewCarousel(e) {
    e.preventDefault();
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
              className="btn-floating waves-effect waves-light"
              onClick={this.viewCarousel}
              name={id}
            ><i className="material-icons" name={id}>pageview</i></button>
            <h5>{title}</h5>
            {formatedContent}
          </div>
        );
      });
    }

    return (
      <div className="container width-85">
        <div className="row">
          <div className="col s12">
            { documents.length > 0 ? <Coverflow
              style={{ height: '1000px', color: '' }}
              width={'auto'}
              height={500}
              displayQuantityOfSide={1}
              navigation
              enableHeading={false}
            >
              {formatedDocuments}
            </Coverflow> :
            <div className="row">
              <div className="col offset-m3 s12 m6">
                <p className="white center-align">
                  Your Book Shelf is EMPTY, Go to
                  Dashboard and Create One Now!</p>
                <img
                  className="empty"
                  src="/public/img/empty.jpg"
                  alt="No Document found"
                />
              </div>
            </div>
            }
          </div>
        </div>
      </div>
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
