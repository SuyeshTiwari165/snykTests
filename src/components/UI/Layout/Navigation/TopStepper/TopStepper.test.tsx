import React from 'react';
import { shallow } from 'enzyme';
import TopStepper from './TopStepper';

describe('<TopStepper />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<TopStepper />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
