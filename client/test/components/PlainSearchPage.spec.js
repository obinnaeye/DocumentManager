import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import PlainSearchPage
  from '../../src/js/components/user/PlainSearchPage';

const mockFunc = () => true;
const props = {
  combinedRendered: mockFunc,
  search: mockFunc,
  inputChange: mockFunc,
  limit: 10,
  offset: 0,
};
const wrapper = shallow(
  <PlainSearchPage {...props} />
);
describe('<PlainSearchPage />', () => {
  it('should render container div', () => {
    expect(wrapper.find('.container').length).toEqual(1);
  });

  it('should render offset and limit as supplied in the props', () => {
    expect(wrapper.contains(
      <input
        id="limit"
        type="number"
        className="validate"
        value={props.limit}
        onChange={props.inputChange}
      />))
      .toBe(true);
    expect(wrapper.contains(
      <input
        id="offset"
        type="number"
        className="validate"
        value={props.offset}
        onChange={props.inputChange}
      />))
      .toBe(true);
  });
});
