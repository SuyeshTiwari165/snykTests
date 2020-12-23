import React from 'react';
import { shallow } from 'enzyme';
import RaStepper from './RaStepper';

describe('<RaStepper />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<RaStepper />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
