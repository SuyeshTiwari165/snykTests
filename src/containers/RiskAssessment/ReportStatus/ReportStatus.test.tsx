import React from 'react';
import { shallow } from 'enzyme';
import ReportStatus from './ReportStatus';

describe('<ReportStatus />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<ReportStatus />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
