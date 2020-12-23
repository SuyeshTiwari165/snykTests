import React from 'react';
import { shallow } from 'enzyme';
import Target from './Target';

describe('<Target />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Target />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
