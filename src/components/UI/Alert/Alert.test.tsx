import React from 'react';
import { shallow } from 'enzyme';
import Alert from './Alert';

describe('<Alert />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Alert />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
