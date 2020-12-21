import React from 'react';
import { shallow } from 'enzyme';
import AddEditForm from './AddEditForm';

describe('<AddEditForm />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<AddEditForm />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
