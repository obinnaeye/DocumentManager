import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import SignupForm from '../../src/js/components/authentication/SignupForm';

const mockFunc = () => true;
const wrapper = shallow(
  <SignupForm onChange={mockFunc} submit={mockFunc} />
);
describe('<SignupForm />', () => {
  it('should render the input element for firstName', () => {
    expect(wrapper.find('#firstName').length).toEqual(1);
    expect(wrapper.find('.validate').length).toEqual(5);
    expect(wrapper.find('input').length).toEqual(6);
  });

  it('should render the input element for password', () => {
    expect(wrapper.find('#password').length).toEqual(1);
  });

  it('should render the submit button', () => {
    expect(wrapper.find('#signup').length).toEqual(1);
  });

  it('should render the Link to singin', () => {
    expect(wrapper.find('Link').length).toEqual(1);
  });

  it('should render supplied props', () => {
    expect(wrapper.props().children)
        .toExist();
  });
});
