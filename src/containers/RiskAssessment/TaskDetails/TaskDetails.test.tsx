import React from 'react';
import { shallow } from 'enzyme';
import TaskDetails from './TaskDetails';

describe('<TaskDetails />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<TaskDetails />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
