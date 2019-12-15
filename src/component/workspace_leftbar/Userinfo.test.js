import React from 'react';
import { shallow } from 'enzyme';
import Userinfo from './Userinfo';

describe('<Userinfo />', () => {
    it('should render without error', () => {
        const component = shallow(<Userinfo />);
        let wrapper = component.find('.userinfo-container');
        expect(wrapper.length).toBe(1);
    });

    it('check nickname', () => {
        // session setting
        sessionStorage.setItem('LoggedInUserId', '1');
        sessionStorage.setItem('LoggedInUserNickname', 'test');

        const component = shallow(<Userinfo />);
        let wrapper = component.find('.userinfo-nickname');
        const nickname = sessionStorage.getItem('LoggedInUserNickname');
        expect(wrapper.text()).toEqual(nickname);

        sessionStorage.clear();
    });
});
