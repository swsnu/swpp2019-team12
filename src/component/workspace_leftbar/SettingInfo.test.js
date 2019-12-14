import React from 'react';
import { shallow, mount } from 'enzyme';
import SettingInfo from './SettingInfo';

describe('<SettingInfo />', () => {
    it('should render without erros', () => {
        const component = shallow(<SettingInfo />);
        const wrapper = component.find('.settingInfo-container');
        expect(wrapper.length).toBe(1);
    });
});
