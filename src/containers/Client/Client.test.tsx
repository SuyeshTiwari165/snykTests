import React from 'react';
import { shallow } from 'enzyme';
import Client from './Client';

describe('<Client />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Client />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
