import findIndex from 'lodash/findIndex';
import actionTypes from '../constants/actionTypes';
import initialState from './initialState';

const documentReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.CREATE_DOCUMENT_SUCCESS: {
    const editID = action.createdDocument.id;
    const stateUserDocuments = state.userDocuments;
    stateUserDocuments.push(action.createdDocument);
    return { ...state,
      userDocuments: stateUserDocuments,
      creatingDocument: true,
      editID
    };
  }

  case actionTypes.CREATE_DOCUMENT_FAILURE:
    return { ...state, creatingDocument: false };
  // This handles any action that gets documents, aside user documents
  case actionTypes.GET_DOCUMENTS_SUCCESS:
    return { ...state, documents: action.documents, fetchingDocuments: true };

  case actionTypes.GET_DOCUMENTS_FAILURE:
    return { ...state, fetchingDocuments: false, count: state.count + 1 || 1 };

  case actionTypes.UPDATE_DOCUMENT_SUCCESS:
    return { ...state,
      documents: action.updatedDocument,
      fetchingDocuments: true,
      count: state.count + 1 || 1
    };

  case actionTypes.UPDATE_DOCUMENT_FAILURE:
    return { ...state, count: state.count + 1 || 1 };

  case actionTypes.GET_USER_DOCUMENTS_SUCCESS:
    return { ...state,
      userDocuments: action.userDocuments,
      count: state.count + 1 || 1
    };

  case actionTypes.GET_USER_DOCUMENTS_FAILURE:
    return { ...state, userDocuments: [], count: state.count + 1 || 1 };

  case actionTypes.DELETE_DOCUMENT_SUCCESS: {
    // Use unary plus to convert id string to number
    const index =
      findIndex(state.documents || state.userDocuments,
      { id: +(action.documentId) });
    let stateDocuments;
    if (state.documents.length > 0) {
      stateDocuments = state.documents.slice(0);
    } else {
      stateDocuments = state.userDocuments.slice(0);
    }
    stateDocuments.splice(index, 1);
    return { ...state,
      documents: stateDocuments,
      deletingDocument: true,
      count: state.count + 1 || 1,
      deleteId: action.documentId
    };
  }

  case actionTypes.DELETE_DOCUMENT_FAILURE:
    return { ...state, deletingDocument: false, count: state.count + 1 || 1 };

  default:
    return state;
  }
};

export default documentReducer;
