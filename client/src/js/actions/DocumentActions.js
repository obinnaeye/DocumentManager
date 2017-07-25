/* global Materialize */
import ajaxCall from 'axios';
import actionTypes from '../constants/actionTypes';
import setToken from '../helper/setTokenHelper';

const testing = process.env.NODE_ENV === 'test';

export const createDocumentSuccess = createdDocument =>
  ({ type: actionTypes.CREATE_DOCUMENT_SUCCESS, createdDocument });

export const createDocumentFailure = () =>
  ({ type: actionTypes.CREATE_DOCUMENT_FAILURE });

export const createDocument = (documentData) => {
  /* istanbul ignore next */
  if (!testing) {
    setToken();
  }
  return dispatch =>
    ajaxCall.post('/documents', documentData)
      .then((response) => {
        dispatch(createDocumentSuccess(response.data));
        /* istanbul ignore next */
        if (!testing) {
          Materialize.toast(
            'Document Saved',
            3000,
            'green'
          );
        }
      })
      .catch((error) => {
        dispatch(createDocumentFailure());
        /* istanbul ignore next */
        if (!testing) {
          if (error.message === 'Request failed with status code 409') {
            Materialize.toast(
              `You already have a document with ${documentData.title},
              please choose a different title!`, 5000, 'red');
          } else {
            Materialize.toast(error.message, 3000, 'red');
          }
        }
      });
};

export const getDocumentsSuccess = documents =>
  ({ type: actionTypes.GET_DOCUMENTS_SUCCESS, documents });

export const getDocumentsFailure = () =>
  ({ type: actionTypes.GET_DOCUMENTS_FAILURE });

export const getDocument = (documentId) => {
  /* istanbul ignore next */
  if (!testing) {
    setToken();
  }
  return dispatch =>
    ajaxCall.get(`/documents/${documentId}`)
      .then((response) => {
        dispatch(getDocumentsSuccess(response.data));
      })
      .catch((error) => {
        dispatch(getDocumentsFailure(error));
      });
};

export const getUserDocumentsFailure = () =>
  ({ type: actionTypes.GET_USER_DOCUMENTS_FAILURE });

export const getUserDocumentsSuccess = userDocuments =>
  ({ type: actionTypes.GET_USER_DOCUMENTS_SUCCESS, userDocuments });

export const getUserDocuments = (userId) => {
  /* istanbul ignore next */
  if (!testing) {
    setToken();
  }
  return dispatch =>
    ajaxCall.get(`/users/${userId}/documents`)
      .then((response) => {
        dispatch(getUserDocumentsSuccess(response.data));
      })
      .catch((error) => {
        dispatch(getUserDocumentsFailure(error));
      });
};

export const getAllDocuments = (offset, limit) => {
  /* istanbul ignore next */
  if (!testing) {
    setToken();
  }
  return dispatch =>
    ajaxCall.get(`/documents/?limit=${limit}&offset=${offset}`)
      .then((response) => {
        dispatch(getDocumentsSuccess(response.data.rows));
      })
      .catch((error) => {
        dispatch(getDocumentsFailure());
         /* istanbul ignore next */
        if (!testing) {
          Materialize.toast(error.message, 3000);
        }
      });
};

export const searchDocuments = (searchData) => {
  /* istanbul ignore next */
  if (!testing) {
    setToken();
  }
  let limit = 10,
    offset = 0,
    q = '';
  /* istanbul ignore next */
  if (searchData) {
    limit = searchData.limit || limit;
    offset = searchData.offset || offset;
    q = searchData.q;
  }
  return dispatch =>
    ajaxCall.get(`/search/documents?q=${q}&limit=${limit}&offset=${offset}`)
      .then((response) => {
        if (response.data.rows.length > 0) {
          dispatch(getDocumentsSuccess(response.data.rows));
        } else {
          dispatch(getDocumentsFailure());
        }
      })
      .catch((error) => {
        dispatch(getDocumentsFailure(error));
      });
};

export const deleteSuccess = documentId =>
  ({ type: actionTypes.DELETE_DOCUMENT_SUCCESS, documentId });

export const deleteFailure = () =>
  ({ type: actionTypes.DELETE_DOCUMENT_FAILURE });

export const deleteDocument = (documentId) => {
  /* istanbul ignore next */
  if (!testing) {
    setToken();
  }
  return dispatch =>
    ajaxCall.delete(`/documents/${documentId}`)
      .then((response) => {
        dispatch(deleteSuccess(documentId));
        /* istanbul ignore next */
        if (!testing) {
          Materialize.toast(response.data.message, 3000, 'green');
        }
      })
      .catch((error) => {
        dispatch(deleteFailure(error));
        /* istanbul ignore next */
        if (!testing) {
          Materialize.toast(error.message, 3000);
        }
      });
};

export const updateSuccess = updatedDocument =>
  ({ type: actionTypes.UPDATE_DOCUMENT_SUCCESS, updatedDocument });

export const updateFailure = () =>
  ({ type: actionTypes.UPDATE_DOCUMENT_FAILURE });

export const updateDocument = (documentData, id) => {
  /* istanbul ignore next */
  if (!testing) {
    setToken();
  }
  return dispatch =>
    ajaxCall.put(`/documents/${id}`, documentData)
      .then((response) => {
        dispatch(updateSuccess(response.data));
         /* istanbul ignore next */
        if (!testing) {
          Materialize.toast('Document Saved', 3000, 'green');
        }
      })
      .catch((error) => {
        dispatch(updateFailure(error));
         /* istanbul ignore next */
        if (!testing) {
          if (error.message === 'Request failed with status code 404') {
            Materialize.toast(`Cannot find document with the id ${id}`);
          } else {
            Materialize.toast(error.message, 3000, 'red');
          }
        }
      });
};

