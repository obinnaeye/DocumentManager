import expect from 'expect';
import documentReducer from '../../src/js/reducers/documentReducer';
import * as documentActions from '../../src/js/actions/DocumentActions';
import initialState from '../../src/js/reducers/initialState';

describe('Document Reducer', () => {
  const documents = [
    {
      title: 'my title',
      content: 'my content',
      id: 1,
      onwerId: 2,
      access: 'public'
    },
    {
      title: 'my title2',
      content: 'my content2',
      id: 2,
      onwerId: 3,
      access: 'private'
    }
  ];
  it('should add created document to the store', () => {
    const newDocument = { title: 'A', content: 'B', access: 'public' };
    const action = documentActions.createDocumentSuccess(newDocument);
    const newState = documentReducer(initialState, action);
    expect(newState.userDocuments.length).toEqual(1);
    expect(newState.userDocuments[0]).toEqual(newDocument);
  });

  it(`should add documents to the state store when 
  getDocuments is successful`,
  () => {
    const action = documentActions.getDocumentsSuccess(documents);
    const newState = documentReducer(initialState, action);
    expect(newState.documents.length).toEqual(2);
    expect(newState.documents).toEqual(documents);
  });

  it('should not add any document to the store if getDocuments fails', () => {
    const action = documentActions.getDocumentsFailure();
    const newState = documentReducer(initialState, action);
    expect(newState.documents.length).toEqual(0);
    expect(newState.fetchingDocuments).toEqual(false);
    expect(newState.count).toEqual(1);
  });

  it(`should add user documents to the store if getting 
  user documents is successful`, () => {
    const action = documentActions.getUserDocumentsSuccess(documents);
    const newState = documentReducer(initialState, action);
    expect(newState.userDocuments.length).toEqual(2);
    expect(newState.userDocuments).toEqual(documents);
  });

  it(`should remove deleted document from store without mutating the store
   if deleting document is successful`, () => {
    const action = documentActions.getDocumentsSuccess(documents);
    const currentState = documentReducer(initialState, action);
    const deleteAction = documentActions.deleteSuccess(1);
    const newState = documentReducer(currentState, deleteAction);
    expect(newState.documents.length).toEqual(1);
    expect(newState.documents[0]).toEqual(currentState.documents[1]);
  });

  it('should return the initial state if no action is matched', () => {
    const action = { type: 'DOES_NOT_MATCH_ANY_ACTION' };
    const newState = documentReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
