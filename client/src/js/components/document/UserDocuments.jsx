/* global $ jwt_decode */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Pagination from 'react-paginate';
import * as DocumentActions from '../../actions/DocumentActions';
import '../../../../public/style/main.scss';
import DocumentCollapsible from './DocumentCollapsible';

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
      documents: [],
      start: 0,
      deleteId: this.props.deleteId
    };

    this.viewDocument = this.viewDocument.bind(this);
    this.pageNavigation = this.pageNavigation.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
  }

  /**
   * @memberOf UserDocuments
   * @returns {void}
   */
  componentDidMount() {
    const { userId } = jwt_decode(localStorage.accessToken);
    this.props.DocumentActions.getUserDocuments(userId);
  }

  /**
   * @param {object} nextProps
   * @returns {void}
   * @memberOf UserDocuments
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.deleteId && nextProps.deleteId !== this.state.deleteId) {
      const { userId } = jwt_decode(localStorage.accessToken);
      this.setState({ deleteId: nextProps.deleteId },
        () => {
          this.props.DocumentActions.getUserDocuments(userId);
        }
      );
      return;
    }
    const allDocuments = nextProps.userDocuments;
    const totalDocuments = allDocuments.length;
    const pageCount = Math.ceil(totalDocuments / 10);
    let { start } = this.state;
    let target;
    let documents = allDocuments.slice(start, start + 10);
    let length;
    if (this.state.target) {
      this.state.target.classList.remove('active');
    }
    if (start > 0 && totalDocuments <= start) {
      start = ((start / 10) - 1) * 10;
      documents = allDocuments.slice(start, start + 10);
      const parent = document.getElementsByClassName('pagination');
      length = parent[0].children.length;
      target = parent[0].children[length - 3];
      if (length === 3) {
        target = parent[0].children[length - 2];
      }
    }
    this.setState({
      allDocuments,
      count: nextProps.count,
      documents,
      pageCount,
      target
    }, () => {
      if (target && length >= 4) {
        target.classList.add('active');
        target.click();
      }
    });
  }

  /**
   * @return {void} Returns void
   * @memberOf UserDocuments
   */
  componentDidUpdate() {
    const testing = process.env.NODE_ENV === 'test';
    if (!testing) {
      $('.collapsible').collapsible();
      this.props = this.props;
    }
  }

  /**
   * @desc Deletes a docuement
   * @param {object} event - triggered event
   * @memberOf UserDocuments
   * @returns {void}
   */
  deleteDocument(event) {
    event.preventDefault();
    const id = event.target.getAttribute('name');
    this.props.DocumentActions.deleteDocument(id);
  }

    /**
   * @desc Navigates to next/previous document list
   * @returns {void} - returns void
   * @param {object} event - target DOM element
   * @memberOf UserDocuments
   */
  pageNavigation(event) {
    const selected = event.selected;
    const start = selected * 10;
    const documents = this.state.allDocuments.slice(start, start + 10);
    this.setState({ documents, start, selected });
  }

  /**
   * @desc Opens a single document
   * @param {object} event - triggered event
   * @returns {void}
   * @memberOf UserDocuments
   */
  viewDocument(event) {
    event.preventDefault();
    const id = event.target.getAttribute('name');
    this.props.history.push(`/dashboard/documents/${id}`);
  }

  /**
   * @returns {element} DOM element div
   * @memberOf UserDocuments
   */
  render() {
    const documents = this.state.documents;
    let formatedDocuments;
    if (documents.length > 0) {
      formatedDocuments = documents.map((myDocument) => {
        const { id, title, content, createdAt, updatedAt, ownerId }
          = myDocument;
        const parsedContent =
          <span dangerouslySetInnerHTML={{ __html: content }} />;
        const { userId, roleId } =
        JSON.parse(localStorage.getItem('user_profile'));
        return (
          <DocumentCollapsible
            key={id}
            id={id}
            title={title}
            createdAt={createdAt}
            updatedAt={updatedAt}
            ownerId={ownerId}
            userId={userId}
            roleId={roleId}
            parsedContent={parsedContent}
            viewDocument={this.viewDocument}
            deleteDocument={this.deleteDocument}
          />
        );
      });
    }

    return (
      <div className="container width-85 top_30">
        <div className="row">
          <div className="col s10 offset-s1">
            { documents.length > 0 ?
              <div className=" scroll-a row col s12" >
                <ul
                  className="collapsible"
                  data-collapsible="accordion"
                  id="mydocs"
                >
                  {formatedDocuments}
                </ul>
                <div className="row">
                  <div className="col s10 offset-s1">
                    <Pagination
                      className="col s2 offset-s1"
                      previousLabel={'previous'}
                      nextLabel={'next'}
                      breakLabel={<a href="">...</a>}
                      breakClassName={'break-me'}
                      pageCount={this.state.pageCount}
                      onPageChange={this.pageNavigation}
                      disableInitialCallback
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'}
                    />
                  </div>
                </div>
              </div>
                :
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
  count: PropTypes.number.isRequired,
  deleteId: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  userDocuments: state.documentReducer.userDocuments,
  count: state.documentReducer.count,
  deleteId: state.documentReducer.deleteId
});

const mapDispatchToProps = dispatch => ({
  DocumentActions: bindActionCreators(DocumentActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDocuments);
