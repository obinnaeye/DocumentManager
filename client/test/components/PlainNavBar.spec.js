import React from 'react';
import { Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import expect from 'expect';
import PlainNavBar from '../../src/js/components/common/PlainNavBar';

const mockFunc = () => true;
const props = {
  authenticated: false,
  signingIn: false,
  createdUser: false,
  logout: mockFunc
};
const wrapper = shallow(
  <PlainNavBar {...props} />
);
describe('<PlainNavBar />', () => {
  it('should render a single nav element', () => {
    expect(wrapper.find('nav').length).toEqual(1);
  });

  it('should render the thumb icon', () => {
    expect(wrapper.find('.fa-thumbs-up').length).toEqual(1);
  });

  it('should render a header element', () => {
    expect(wrapper.find('header').length).toEqual(1);
  });

  it('should render a ul element', () => {
    expect(wrapper.find('ul').length).toEqual(2);
  });

  it('should render Signup if not authenticated', () => {
    expect(wrapper.contains(
      <li key="dashboard"><Link to="/signin">Signin</Link></li>))
      .toBe(true);
  });

  it('should render supplied props', () => {
    expect(wrapper.props().children)
        .toExist();
  });
});
