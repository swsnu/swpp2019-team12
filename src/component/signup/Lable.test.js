import React from 'react';
import { shallow } from 'enzyme';
import { Label, SubLabel } from './Label';

describe('<Label />, <SubLabel />', () => {
    it('should render without error', () => {
        const component = shallow(<Label />);
        let wrapper = component.find('.signup-input-label');
        expect(wrapper.length).toBe(1);
    });

    it('should render without error', () => {
        const component = shallow(<SubLabel />);
        let wrapper = component.find('.signup-input-sublabel');
        expect(wrapper.length).toBe(1);
    });
});
