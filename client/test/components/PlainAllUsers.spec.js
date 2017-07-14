import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import PlainAllUsers
  from '../../src/js/components/user/PlainAllUsers';

const mockFunc = () => true;
const users = [{
  id: 1,
  firstName: 'first',
  lastName: 'last',
  roleId: 2,
  email: 'first@last.com',
},
{
  id: 1,
  firstName: 'first',
  lastName: 'last',
  roleId: 2,
  email: 'first@last.com',
}
];
const props = {
  inputChange: mockFunc,
  limit: 10,
  offset: 0,
  users,
  renderedUsers: mockFunc
};
const wrapper = shallow(
  <PlainAllUsers {...props} />
);
describe('<PlainAllUsers />', () => {
  it('should render container div', () => {
    expect(wrapper.find('.container').length).toEqual(1);
  });

  it('should not render img if users is supplied', () => {
    expect(wrapper.find('img').length).toEqual(0);
  });

  it('should render only 3 elements with className of row if users is supplied',
  () => {
    expect(wrapper.find('.row').length).toEqual(4);
  });

  const newUsers = [];
  props.users = newUsers;
  const wrapper2 = shallow(
    <PlainAllUsers {...props} />);
  it('should render img if user does not exist', () => {
    expect(wrapper2.find('img').length).toEqual(1);
  });
});
