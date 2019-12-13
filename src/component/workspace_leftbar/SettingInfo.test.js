import React from 'react';
import { shallow } from 'enzyme';
import SettingInfo from './SettingInfo';

describe('<Signout />', () => {
    it('should render without error', () => {
        const component = shallow(<SettingInfo />);
        let wrapper = component.find('.settingInfo-container');
        expect(wrapper.length).toBe(1);
    });
});
