import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import PlainNewDocument
  from '../../src/js/components/document/PlainNewDocument';

const mockFunc = () => true;
const props = {
  saveExit: mockFunc,
  save: mockFunc,
  exit: mockFunc
};
const wrapper = shallow(
  <PlainNewDocument {...props} />
);
describe('<PlainNewDocument />', () => {
  it('should render container div', () => {
    expect(wrapper.find('#my-container').childAt(0).type()).toEqual('div');
  });

  it('should render content in the <textarea>', () => {
    expect(wrapper.find('#access').type()).toBe('select');
  });
});
