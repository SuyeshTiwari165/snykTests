import React from 'react';
import { shallow } from 'enzyme';
import PartnerUser from './PartnerUser';

describe('<PartnerUser />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PartnerUser />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
