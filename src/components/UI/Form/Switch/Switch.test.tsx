import React from 'react';
import { shallow } from 'enzyme';
import Switch from './Switch';

describe('<Switch />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Switch />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
