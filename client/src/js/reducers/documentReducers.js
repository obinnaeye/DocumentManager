import findIndex from 'lodash/findIndex';
import actionTypes from '../constants/actionTypes';

const initialState = { documents: [], userDocuments: [] };

const documentReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.CREATE_DOCUMENT_SUCCESS: {
    const stateUserDocuments = state.userDocuments;
    return { ...state,
      userDocuments: stateUserDocuments.push(action.createdDocument)
    };
  }
  // This handles any action that gets documents, aside user documents
  case actionTypes.GET_DOCUMENTS_SUCCESS:
    return { ...state, documents: action.documents };

  case actionTypes.GET_USER_DOCUMENTS_SUCCESS:
    return { ...state, userDocuments: action.userDocuments };

  case actionTypes.DELETE_DOCUMENT_SUCCESS: {
    const index =
      findIndex(state[0].userDocuments, { id: action.documentId });
    const stateUserDocuments = state.userDocuments;
    stateUserDocuments.splice(index, 1);
    return { ...state, userDocuments: stateUserDocuments };
    // remove the document also from state's documents ....
  }
  default:
    return state;
  }
};

export default documentReducer;
