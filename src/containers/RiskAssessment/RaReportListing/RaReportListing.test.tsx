import React from 'react';
import { shallow } from 'enzyme';
import RaReportListing from './RaReportListing';

describe('<RaReportListing />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<RaReportListing />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
