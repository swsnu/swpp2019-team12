import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import SingleScript from './SingleScript';

describe('<Image />', () => {
    it('should render without errors', () => {
        const component = shallow(<SingleScript script={' '} />);
        const wrapper = component.find('.SingleScript-input');
        expect(wrapper.length).toBe(1);
    });
});
