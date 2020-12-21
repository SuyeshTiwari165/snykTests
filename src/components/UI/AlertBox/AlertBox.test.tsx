import React from 'react';
import { shallow } from 'enzyme';
import AlertBox from './AlertBox';

describe('<AlertBox />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<AlertBox />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
