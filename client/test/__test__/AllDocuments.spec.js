import configureStore from 'redux-mock-store';
import React from 'react';
import expect from 'expect';
import 'jsdom-global/register';
import sinon from 'sinon';
import jQuery from  'jQuery';
import { shallow, mount } from 'enzyme';
import thunk from 'redux-thunk';
import initialState from '../../src/js/reducers/initialState';
import AllDocuments, { AllDocuments as PlainComponent } from '../../src/js/components/document/AllDocuments';
import * as DocumentActions from '../../src/js/actions/DocumentActions';
import PlainAllDocuments
  from '../../src/js/components/document/PlainAllDocuments';

global.localStorage = {
  getItem: item =>
    JSON.stringify({ userId: 1, roleId: 2, item })
};
global.$ = jQuery;

const middlewares = [thunk]; // add your middlewares like `redux-thunk`

describe('<AllDocuments />', () => {
  xdescribe('With initial state',
  () => {
    const mockStore = configureStore();
    let store, container;

    beforeEach(() => {
      store = mockStore(initialState);
      container = shallow(<AllDocuments store={store} />).dive();
    });

    it('should render the connected(SMART) component', () => {
      //console.log('contsd', container.instance());
      expect(container.length).toEqual(1);
      expect(container.instance().props.documents).toEqual(
        initialState.documentReducer.documents);
    });

    it('should render child components', () => {
      expect(container.find('#offset').length).toEqual(0);
      expect(container.find(PlainAllDocuments).length).toEqual(1);
    });

    // more of integration test
    it('should be connected to dispatch', () => {
      store.dispatch(
        DocumentActions
        .createDocumentSuccess({ content: 'me', title: 'title' }));
      store.dispatch(
        DocumentActions.getDocumentsSuccess({ content: 'me', title: 'title' }));
      const action = store.getActions();
      expect(action[0].type).toBe('CREATE_DOCUMENT_SUCCESS');
      expect(action[1].type).toBe('GET_DOCUMENTS_SUCCESS');
    });
  });

  describe('When state is updated with documents',
  () => {
    const mockStore = configureStore();
    let store, container;

    beforeEach(() => {
      initialState.documentReducer.fetchingDocuments = true;
      initialState.documentReducer.documents =
        [{ content: 'my content', title: 'my title' }];
      store = mockStore(initialState);
      container = shallow(<AllDocuments store={store} />).dive();
    });

    it('should render the connected(SMART) component', () => {
      expect(container.length).toEqual(1);
      expect(container.instance()
        .renderedDocuments()[0].props.title).toEqual('my title');
    });

    it('Triggers a new search as the user types', () => {
      const onChangeStub = sinon.spy();
      const props = {
        inputChange: onChangeStub,
        limit: 10,
        offset: 0,
        documents: [],
        renderedDocuments: () => {},
        pageNavigation: () => {},
        pagecount: 2,
        initialPage: 0
      };
      const wrapper = shallow(<PlainAllDocuments {...props} />);
      const limitField = wrapper.find('#limit');
      //console.log('limit', limitField);
      const event1 = { target: { value: 2 } };
      //const event2 = { target: { value: 5 } };

      limitField.simulate('change', event1);
      //limitField.simulate('change', event2);
      //console.log('counterlimit', limitField);
      expect(onChangeStub.calledOnce).toEqual(true);
    });
  });

  describe('Mounted',
  () => {
    const mockStore = configureStore(middlewares);
    let store, container;

    beforeEach(() => {
      initialState.documentReducer.fetchingDocuments = true;
      initialState.documentReducer.documents =
        [{ content: 'my content', title: 'my title', ownerId: 2, id: 2 }];
      const props = {
        documents: initialState.documentReducer.documents,
        fetchingDocuments: true,
        count: 0,
        deletingDocument: false,
        DocumentActions,
        componentDidUpdate: () => true
      };
      store = mockStore(initialState);
      container = mount(<AllDocuments.WrappedComponent {...props} />);
      //const wrapper = shallow(<PlainComponent {...props} />);
      //console.log('instance....', container.instance());
    });

    it('should call on change on limit input fieldz', () => {
      const spyLimitInput = sinon.spy(container.instance(), 'inputChange');
      const limitField = container.find('#limit');
      const deleteButton = container.find('DocumentCollapsible').nodes[0];
      const event = {
        target:
        { value: 2,
          getAttribute: () => 'limit'
        }
      };
      //console.log('....limit', spyLimitInput, 'field', limitField);
      limitField.simulate('change', event);
      expect(container.length).toEqual(1);
      console.log('....limit', deleteButton);
      //expect(spyLimitInput.calledOnce).toEqual(true);
    });
  });
});

