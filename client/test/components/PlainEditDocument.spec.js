import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import PlainEditDocument
  from '../../src/js/components/document/PlainEditDocument';

const mockFunc = () => true;
const props = {
  access: 'public',
  handleChange: mockFunc,
  saveExit: mockFunc,
  save: mockFunc,
  exit: mockFunc,
  content: 'My content'
};
const wrapper = shallow(
  <PlainEditDocument {...props} />
);
describe('<PlainEditDocument />', () => {
  it('should render container div', () => {
    expect(wrapper.find('.edit-document-container').length).toEqual(1);
  });

  it('should render content in the <textarea>', () => {
    expect(wrapper.contains(
      <textarea name="editor" id="editor" value={props.content} />))
      .toBe(true);
  });
});
