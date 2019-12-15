import React from 'react';
import { shallow } from 'enzyme';
import { Label, SubLabel } from './Label';

describe('<Label />, <SubLabel />', () => {
    it('should render without error', () => {
        const component = shallow(<Label />);
        let titleWrapper = component.find('.workspace-leftbar-label__title');
        let lineWrapper = component.find('.workspace-leftbar-label__line');
        expect(titleWrapper.length).toBe(1);
        expect(lineWrapper.length).toBe(1);
    });

    it('should render without error', () => {
        const component = shallow(<SubLabel />);
        let titleWrapper = component.find('.workspace-leftbar-sublabel__title');
        let lineWrapper = component.find('.workspace-leftbar-sublabel__line');
        expect(titleWrapper.length).toBe(1);
        expect(lineWrapper.length).toBe(1);
    });
});
