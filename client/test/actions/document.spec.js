import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import nockAjaxCall from 'nock';
import ajaxCall from 'axios';
import * as documentActions from '../../src/js/actions/DocumentActions';
import actionTypes from '../../src/js/constants/actionTypes';
import url from '../helper/constant';

const baseUrl = url.baseUrl;

// set ajaxCall call default base url to localhost
ajaxCall.defaults.baseURL = baseUrl;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Document Actions:', () => {
  const documents = [{
    title: 'title',
    id: 2,
    access: 'public',
    ownerId: 2
  }];
  const singleDocument = {
    title: 'title',
    id: 2,
    access: 'public',
    ownerId: 2
  };
  describe('Create Document', () => {
    afterEach(() => {
      nockAjaxCall.cleanAll();
    });
    it('creates CREATE_DOCUMENT_SUCCESS when document is created',
      () => {
        nockAjaxCall(baseUrl)
          .post('/documents')
          .reply(200, singleDocument);

        const expectedActions = [{ type: actionTypes.CREATE_DOCUMENT_SUCCESS,
          createdDocument: singleDocument }];

        const store = mockStore({});

        store.dispatch(documentActions.createDocument(singleDocument))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    it('creates CREATE_DOCUMENT_FAILURE when an error is encountered',
      () => {
        nockAjaxCall(baseUrl)
          .delete('/documents')
          .reply(409);

        const expectedActions = [{ type: actionTypes.CREATE_DOCUMENT_FAILURE }];

        const store = mockStore({});

        store.dispatch(documentActions.createDocument(singleDocument))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
  });
  describe('Get user',
    () => {
      afterEach(() => {
        nockAjaxCall.cleanAll();
      });

      it('should create GET_DOCUMENTS_SUCCESS when document is found', () => {
        nockAjaxCall(baseUrl)
          .get(`/documents/${2}`)
          .reply(200, singleDocument);

        const expectedActions = [{ type: actionTypes.GET_DOCUMENTS_SUCCESS,
          documents: singleDocument }];

        const store = mockStore({});

        store.dispatch(documentActions.getDocument(2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates GET_DOCUMENTS_FAILURE when an error is encountered',
      () => {
        nockAjaxCall(baseUrl)
          .get(`/documents/${2}`)
          .reply(404);

        const expectedActions = [{ type: actionTypes.GET_DOCUMENTS_FAILURE }];

        const store = mockStore({});

        store.dispatch(documentActions.getDocument(2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });
  describe('Search documents',
    () => {
      afterEach(() => {
        nockAjaxCall.cleanAll();
      });

      it('should create GET_DOCUMENTS_SUCCESS when document is found', () => {
        const search = {
          q: 'title',
          limit: 10,
          offset: 0
        };
        nockAjaxCall(baseUrl)
          .get('/search/documents')
          .query({ q: 'title', limit: 10, offset: 0 })
          .reply(200, documents);

        const expectedActions = [{ type: actionTypes.GET_DOCUMENTS_SUCCESS,
          documents }];

        const store = mockStore({});

        store.dispatch(documentActions.searchDocuments(search))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates GET_DOCUMENTS_FAILURE when an error is encountered',
      () => {
        const search = {
          q: 'ob',
          limit: 2,
          offset: 0
        };
        nockAjaxCall(baseUrl)
          .get('/search/documents')
          .query({ q: 'ob', limit: 2, offset: 0 })
          .reply(404);

        const expectedActions = [{ type: actionTypes.GET_DOCUMENTS_FAILURE }];

        const store = mockStore({});

        store.dispatch(documentActions.searchDocuments(search))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

  describe('Get All Documents',
    () => {
      afterEach(() => {
        nockAjaxCall.cleanAll();
      });

      it('should create GET_DOCUMENTS_SUCCESS when document is found', () => {
        nockAjaxCall(baseUrl)
          .get('/documents/')
          .query({ offset: 0, limit: 2 })
          .reply(200, documents);

        const expectedActions = [{ type: actionTypes.GET_DOCUMENTS_SUCCESS,
          documents }];

        const store = mockStore({});

        store.dispatch(documentActions.getAllDocuments(0, 2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates GET_DOCUMENTS_FAILURE when an error is encountered',
      () => {
        nockAjaxCall(baseUrl)
          .get('/documents/')
          .query({ offset: 0, limit: 2 })
          .reply(404);

        const expectedActions = [{ type: actionTypes.GET_DOCUMENTS_FAILURE }];

        const store = mockStore({});

        store.dispatch(documentActions.getAllDocuments(0, 2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

  describe('Get User Documents',
    () => {
      afterEach(() => {
        nockAjaxCall.cleanAll();
      });

      it('should create GET_USER_DOCUMENTS_SUCCESS when document is found',
      () => {
        nockAjaxCall(baseUrl)
          .get(`/users/${2}/documents`)
          .reply(200, documents);

        const expectedActions = [{ type: actionTypes.GET_USER_DOCUMENTS_SUCCESS,
          userDocuments: documents }];

        const store = mockStore({});

        store.dispatch(documentActions.getUserDocuments(2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates GET_USER_DOCUMENTS_FAILURE when an error is encountered',
      () => {
        nockAjaxCall(baseUrl)
          .get(`/users/${2}/documents`)
          .reply(404);

        const expectedActions = [{
          type: actionTypes.GET_USER_DOCUMENTS_FAILURE
        }];

        const store = mockStore({});

        store.dispatch(documentActions.getUserDocuments(2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });
  describe('Update Document',
    () => {
      afterEach(() => {
        nockAjaxCall.cleanAll();
      });
      it('should create UPDATE_DOCUMENT_SUCCESS when document is updated',
      () => {
        nockAjaxCall(baseUrl)
          .put(`/documents/${2}`)
          .reply(200, singleDocument);

        const expectedActions = [{ type: actionTypes.UPDATE_DOCUMENT_SUCCESS,
          updatedDocument: singleDocument }];

        const store = mockStore({});

        store.dispatch(documentActions.updateDocument(singleDocument, 2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates UPDATE_DOCUMENT_FAILURE when an error is encountered', () => {
        nockAjaxCall(baseUrl)
          .put(`/documents/${2}`)
          .reply(404);

        const expectedActions = [{ type: actionTypes.UPDATE_DOCUMENT_FAILURE }];

        const store = mockStore({});

        store.dispatch(documentActions.updateDocument(singleDocument, 2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

  describe('Delete Document', () => {
    afterEach(() => {
      nockAjaxCall.cleanAll();
    });
    it('creates DELETE_DOCUMENT_SUCCESS when document is deleted',
      () => {
        nockAjaxCall(baseUrl)
          .delete(`/documents/${2}`)
          .reply(200);

        const expectedActions = [{ type: actionTypes.DELETE_DOCUMENT_SUCCESS,
          documentId: 2 }];

        const store = mockStore({});

        store.dispatch(documentActions.deleteDocument(2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    it('creates DELETE_DOCUMENT_FAILURE when an error is encountered',
      () => {
        nockAjaxCall(baseUrl)
          .delete(`/documents/${2}`)
          .reply(400);

        const expectedActions = [{ type: actionTypes.DELETE_DOCUMENT_FAILURE }];

        const store = mockStore({});

        store.dispatch(documentActions.deleteDocument(2))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
  });
});
