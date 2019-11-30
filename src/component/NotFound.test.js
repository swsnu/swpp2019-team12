import React from 'react';
import { shallow } from 'enzyme';
import NotFonud from './NotFound';

describe('<NotFound />', () => {
    it('should render without error', () => {
        const component = shallow(<NotFonud />);
        let wrapper = component.find('.NotFound');
        expect(wrapper.length).toBe(1);
    });
});
