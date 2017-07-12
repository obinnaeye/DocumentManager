import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import PlainDocumentView
  from '../../src/js/components/document/PlainDocumentView';

const mockFunc = () => true;
const props = {
  title: 'My title',
  parsedContent: <div>Content</div>,
  editDocument: mockFunc,
  id: 2,
  deleteDocument: mockFunc
};
const wrapper = shallow(
  <PlainDocumentView {...props} />
);
describe('<PlainDocumentView />', () => {
  it('should render container div', () => {
    expect(wrapper.find('.container').length).toEqual(1);
  });

  it('should render a delete icon', () => {
    expect(wrapper.contains(
      <i
        className="material-icons"
        name={2}
      >delete</i>))
      .toBe(true);
  });
});
