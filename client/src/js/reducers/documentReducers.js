import findIndex from 'lodash/findIndex';
import actionTypes from '../constants/actionTypes';

const initialState = { documents: [], userDocuments: [] };

const documentReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.CREATE_DOCUMENT_SUCCESS: {
    const editID = action.createdDocument.id;
    const stateUserDocuments = state.userDocuments;
    return { ...state,
      userDocuments: stateUserDocuments.push(action.createdDocument),
      editID
    };
  }
  // This handles any action that gets documents, aside user documents
  case actionTypes.GET_DOCUMENTS_SUCCESS:
    return { ...state, documents: action.documents, fetchingDocuments: true };

  case actionTypes.GET_DOCUMENTS_FAILURE:
    return { ...state, fetchingDocuments: false, count: state.count + 1 || 1 };

  case actionTypes.GET_USER_DOCUMENTS_SUCCESS:
    return { ...state, userDocuments: action.userDocuments };

  case actionTypes.DELETE_DOCUMENT_SUCCESS: {
    console.log(state.documents, 'state', action.documentId)
    const index =
      findIndex(state.documents, { id: action.documentId });
    console.log(index);
    const stateDocuments = state.documents;
    stateDocuments.splice(index, 1);
    console.log('docuemnts', stateDocuments, 'index', index);
    return { ...state, documents: stateDocuments };
  }

  // case actionTypes.UPDATE_DOCUMENT_SUCCESS:
  // //format well
  //   return { ...state, documents: action.updatedDocument };
  default:
    return state;
  }
};

export default documentReducer;
