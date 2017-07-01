/* global Materialize */
import ajaxCall from 'axios';
import actionTypes from '../constants/actionTypes';
import setToken from '../helper/setTokenHelper';


export const createDocumentSuccess = createdDocument =>
  ({ type: actionTypes.CREATE_DOCUMENT_SUCCESS, createdDocument });

export const createDocumentFailure = () =>
  ({ type: actionTypes.CREATE_DOCUMENT_FAILURE });

export const createDocument = (documentData) => {
  setToken();
  return dispatch =>
    ajaxCall.post('/documents', documentData)
      .then((response) => {
        dispatch(createDocumentSuccess(response.data));
        Materialize.toast(
          'Document Saved',
          3000,
          'green'
        );
      })
      .catch((error) => {
        dispatch(createDocumentFailure());
        if (error.message === 'Request failed with status code 409') {
          Materialize.toast(
            `You already have a document with ${documentData.title},
            please choose a different title!`, 5000, 'red');
        } else {
          Materialize.toast(error.message, 3000, 'red');
        }
      });
};

export const getDocumentsSuccess = documents =>
  ({ type: actionTypes.GET_DOCUMENTS_SUCCESS, documents });

export const getDocumentsFailure = () =>
  ({ type: actionTypes.GET_DOCUMENTS_FAILURE });

export const getDocument = (documentId) => {
  setToken();
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
  setToken();
  return dispatch =>
    ajaxCall.get(`/users/${userId}/documents`)
      .then((response) => {
        dispatch(getUserDocumentsSuccess(response.data));
      })
      .catch((error) => {
        dispatch(getUserDocumentsFailure(error));
      });
};

export const getAllDocuments = () => {
  setToken();
  return dispatch =>
    ajaxCall.get('/documents/')
      .then((response) => {
        dispatch(getDocumentsSuccess(response.data));
      })
      .catch((error) => {
        dispatch(getDocumentsFailure());
        Materialize.toast(error.message, 3000);
      });
};

export const searchDocuments = (searchData) => {
  setToken();
  let limit = 10,
    offset = 0,
    q = '';

  if (searchData) {
    limit = searchData.limit || limit;
    offset = searchData.offset || offset;
    q = searchData.q;
  }
  return dispatch =>
    ajaxCall.get(`/search/documents?q=${q}&limit=${limit}&offset=${offset}`)
      .then((response) => {
        dispatch(getDocumentsSuccess(response.data));
      })
      .catch((error) => {
        dispatch(getDocumentsFailure(error));
      });
};

export const deleteSuccess = documentId =>
  ({ type: actionTypes.DELETE_DOCUMENT_SUCCESS, documentId });

export const deleteDocument = (documentId) => {
  setToken();
  return dispatch =>
    ajaxCall.delete(`/documents/${documentId}`)
      .then((response) => {
        dispatch(deleteSuccess(documentId));
        Materialize.toast(response.data.message, 3000, 'green');
      })
      .catch((error) => {
        Materialize.toast(error.message, 3000);
      });
};

export const updateSuccess = updatedDocument =>
  ({ type: actionTypes.UPDATE_DOCUMENT_SUCCESS, updatedDocument });

export const updateDocument = (documentData, id) => {
  setToken();
  return dispatch =>
    ajaxCall.put(`/documents/${id}`, documentData)
      .then((response) => {
        dispatch(updateSuccess(response.data));
        Materialize.toast('Document Saved', 3000, 'green');
      })
      .catch((error) => {
        if (error.message === 'Request failed with status code 404') {
          Materialize.toast(`Cannot find document with the id ${id}`);
        } else {
          Materialize.toast(error.message, 3000, 'red');
        }
      });
};

