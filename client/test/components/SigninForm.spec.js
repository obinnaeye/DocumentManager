import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import SigninForm from '../../src/js/components/authentication/SigninForm';

const mockFunc = () => true;
const wrapper = shallow(
  <SigninForm onChange={mockFunc} submit={mockFunc} />
);
describe('<SigninForm />', () => {
  it('should render the input element for email', () => {
    expect(wrapper.find('#email').length).toEqual(1);
    expect(wrapper.find('.validate').length).toEqual(2);
    expect(wrapper.find('input').length).toEqual(3);
  });

  it('should render the input element for password', () => {
    expect(wrapper.find('#password').length).toEqual(1);
  });

  it('should render the submit button', () => {
    expect(wrapper.find('#signin').length).toEqual(1);
  });

  it('should render the Link to signup', () => {
    expect(wrapper.find('Link').length).toEqual(1);
  });

  it('should render supplied props', () => {
    expect(wrapper.props().children)
        .toExist();
  });
});
