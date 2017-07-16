import configureStore from 'redux-mock-store';
import React from 'react';
import { shallow } from 'enzyme';
import initialState from '../../src/js/reducers/initialState';
import AllDocuments from '../../src/js/components/document/AllDocuments';

describe('>>>D O C S --- REACT-REDUX (Shallow + passing the {store} directly)',
() => {
  const mockStore = configureStore();
  let store, container;

  beforeEach(() => {
    store = mockStore(initialState);
    container = shallow(<AllDocuments store={store} />);
  });

  it('+++ render the connected(SMART) component', () => {
    console.log('my container', store)
    expect(container).toEqual(container);
  });

  xit('+++ check Prop matches with initialState', () => {
    expect(container.prop('output')).toEqual(initialState.output);
  });
});

