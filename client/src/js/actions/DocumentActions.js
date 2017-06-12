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
          3000
        );
      })
      .catch((error) => {
        dispatch(createDocumentFailure());
        console.log(error.message);
        if (error.message === 'Request failed with status code 409') {
           Materialize.toast(`You already have a document with ${documentData.title}, please choose a different title!`, 5000, 'red');
        } else {
           Materialize.toast(error.message, 3000);
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

export const getUserDocuments = () => {
  setToken();
  return dispatch =>
    ajaxCall.get('/users/6/documents')
      .then((response) => {
        dispatch(getUserDocumentsSuccess(response.data));
      })
      .catch((error) => {
        dispatch(getUserDocumentsFailure(error));
      });
};

export const getAllDocuments = (searchData) => {
  const { limit, offset } = searchData;
  return dispatch =>
    ajaxCall.get(`/documents/?limit=${limit}offset=${offset}`)
      .then((response) => {
        dispatch(getDocumentsSuccess(response.data));
        Materialize.toast(
          'Document Saved',
          3000
        );
      })
      .catch((error) => {
        dispatch(getDocumentsFailure());
        Materialize.toast(error.message, 3000);
      });
};

export const deleteSuccess = documentId =>
  ({ type: actionTypes.DELETE_DOCUMENT_SUCCESS, documentId });

export const deleteDocument = (documentId) => {
  setToken();
  return dispatch =>
    ajaxCall.delete(`/documents/${documentId}`)
      .then((response) => {
        Materialize.toast(response.data.message, 3000);
        dispatch(deleteSuccess(documentId));
        return response.data.message; // check wether to delete
      })
      .catch((error) => {
        Materialize.toast(error.message, 3000);
      });
};

