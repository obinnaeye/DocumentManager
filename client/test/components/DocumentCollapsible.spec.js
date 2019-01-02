import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import DocumentCollapsible
  from '../../src/js/components/document/DocumentCollapsible';

const mockFunc = () => true;
const props = {
  id: 2,
  title: 'my title',
  createdAt: '',
  updatedAt: '',
  ownerId: 3,
  userId: 2,
  roleId: 1,
  parsedContent: <div>No Documents</div>,
  viewDocument: mockFunc,
  deleteDocument: mockFunc
};
const wrapper = shallow(
  <DocumentCollapsible {...props} />
);
describe('<DocumentCollapsible />', () => {
  it('should render a single li element', () => {
    expect(wrapper.find('li').length).toEqual(1);
  });

  it('should render the liberary icon', () => {
    expect(wrapper.contains(
      <i className="material-icons orange">library_books</i>))
      .toBe(true);
  });

  it('should render Signup if not authenticated', () => {
    expect(wrapper.contains(
      <span><b>Title: </b> <em>my title </em> ||</span>))
      .toBe(true);
  });

  const newTitle = 'My title is very long and will be truncated';
  props.title = newTitle;
  const wrapper2 = shallow(
    <DocumentCollapsible {...props} />);
  it('should render the liberary icon', () => {
    expect(wrapper2.find('.m10').childAt(1).text())
      .toBe('Title: My title is very long and w...  ||');
  });
});
