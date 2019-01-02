import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import UserCollapsible
  from '../../src/js/components/user/UserCollapsible';

const mockFunc = () => true;
const props = {
  userId: 1,
  firstName: 'admin',
  lastName: 'last',
  email: 'admin@last.com',
  roleId: 1,
  editUser: mockFunc,
  deleteUser: mockFunc
};
const wrapper = shallow(
  <UserCollapsible {...props} />
);
describe('<UserCollapsible />', () => {
  it('should render a single li element', () => {
    expect(wrapper.find('li').length).toEqual(1);
  });

  it('should render the person icon', () => {
    expect(wrapper.contains(
      <i className="material-icons orange">person</i>))
      .toBe(true);
  });

  it('should render firstName supplied in the props', () => {
    expect(wrapper.contains(
      <span> <b>FirstName:</b> {props.firstName} </span>))
      .toBe(true);
  });

  it('should render edit button for admin', () => {
    expect(wrapper.contains(
      <i
        className="material-icons my-pointer"
        name={props.userId}
      >mode_edit</i>))
      .toBe(true);
  });

  props.roleId = 3;
  const wrapper2 = shallow(
    <UserCollapsible {...props} />);
  it('should not render edit button for non-admin', () => {
    expect(wrapper2.contains(
      <i
        className="material-icons my-pointer"
        name={props.userId}
      >mode_edit</i>))
      .toBe(false);
  });
});
