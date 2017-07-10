import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import PlainEditProfile
  from '../../src/js/components/user/PlainEditProfile';

const mockFunc = () => true;
const props = {
  firstName: 'first',
  lastName: 'last',
  updateProfile: mockFunc,
  email: 'first@last.com',
  onChange: mockFunc
};
const wrapper = shallow(
  <PlainEditProfile {...props} />
);
describe('<PlainEditProfile />', () => {
  it('should render container div', () => {
    expect(wrapper.find('.container').length).toEqual(1);
  });

  it('should render firstName and lastName as supplied in the props', () => {
    expect(wrapper.contains(
      <input
        value={props.lastName}
        id="lastName"
        type="text"
        className="validate"
        onChange={mockFunc}
        required
      />))
      .toBe(true);

    expect(wrapper.contains(
      <input
        value={props.firstName}
        id="firstName"
        type="text"
        className="validate"
        onChange={mockFunc}
        required
      />))
      .toBe(true);
  });
});
