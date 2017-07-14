import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import PlainAllDocuments
  from '../../src/js/components/document/PlainAllDocuments';

const mockFunc = () => true;
const documents = [{
  id: 1,
  ownerId: 1,
  access: 'public',
  title: 'My title',
  content: 'My content',
},
{
  id: 2,
  OwnerId: 2,
  access: 'public',
  title: 'My title2',
  content: 'My content2',
}
];
const props = {
  inputChange: mockFunc,
  limit: 10,
  offset: 0,
  documents,
  renderedDocuments: mockFunc
};
const wrapper = shallow(
  <PlainAllDocuments {...props} />
);
describe('<PlainAllDocuments />', () => {
  it('should render container div', () => {
    expect(wrapper.find('.container').length).toEqual(1);
  });

  it('should render collapsible if document exists', () => {
    expect(wrapper.find('.collapsible').length).toEqual(1);
    expect(wrapper.find('.scroll-a').length).toEqual(1);
    expect(wrapper.find('.row').length).toEqual(4);
  });

  const newDocuments = [];
  props.documents = newDocuments;
  const wrapper2 = shallow(
    <PlainAllDocuments {...props} />);
  it('should render collapsible if document exists', () => {
    expect(wrapper2.find('.collapsible').length).toEqual(0);
    expect(wrapper2.find('.scroll-a').length).toEqual(0);
    expect(wrapper2.find('.row').length).toEqual(3);
  });
});
