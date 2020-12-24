import React from 'react';
import { shallow } from '../../PartnerUser/node_modules/enzyme';
import Partner from './Partner';

describe('<Partner />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Partner />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
