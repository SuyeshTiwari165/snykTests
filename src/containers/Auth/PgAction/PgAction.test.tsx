import React from 'react';
import { shallow } from 'enzyme';
import PgAction from './PgAction';

describe('<PgAction />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PgAction />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
