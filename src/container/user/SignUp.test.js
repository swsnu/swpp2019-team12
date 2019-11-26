import React from 'react';
import { shallow } from 'enzyme';
import SignUp from './SignUp';

describe('<SignUp />', () => {
    it('should render without erros', () => {
        const component = shallow(<SignUp />);
        const wrapper = component.find('.SignUp');
        expect(wrapper.length).toBe(1);
    });

    it('should set state properly on email input', () => {
        const email = 'test@test.com';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_email');
        wrapper.simulate('change', { target: { value: email } });
        const instance = component.instance();
        expect(instance.state.email).toEqual('test@test.com');
    });

    it('should set state properly on password input', () => {
        const password = 'testpassword';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_password');
        wrapper.simulate('change', { target: { value: password } });
        const instance = component.instance();
        expect(instance.state.password).toEqual('testpassword');
    });

    it('should set state properly on password_confirmation input', () => {
        const password_confirmation = 'testpassword';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_password_confirmation');
        wrapper.simulate('change', {
            target: { value: password_confirmation }
        });
        const instance = component.instance();
        expect(instance.state.password_confirmation).toEqual('testpassword');
    });

    it('should set state properly on nickname input', () => {
        const nickname = 'testNickName';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_nickname');
        wrapper.simulate('change', { target: { value: nickname } });
        const instance = component.instance();
        expect(instance.state.nickname).toEqual('testNickName');
    });

    it('should keep disabled when some inputs are missing', () => {
        // password_confirmation is missing in inputs
        const email = 'test@test.com';
        const password = 'testpassword';
        const nickname = 'testNickName';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_email');
        wrapper.simulate('change', { target: { value: email } });

        wrapper = component.find('#user_password');
        wrapper.simulate('change', { target: { value: password } });

        wrapper = component.find('#user_nickname');
        wrapper.simulate('change', { target: { value: nickname } });

        wrapper = component.find('#sign_up_button');
        expect(wrapper.props()).toHaveProperty('disabled', true);
    });

    it('should be clicked when all inputs are correct ', () => {
        const email = 'test@test.com';
        const password = 'TestPassword12!@';
        const password_confirmation = 'TestPassword12!@';
        const nickname = 'testNickName';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_email');
        wrapper.simulate('change', { target: { value: email } });

        wrapper = component.find('#user_password');
        wrapper.simulate('change', { target: { value: password } });

        wrapper = component.find('#user_password_confirmation');
        wrapper.simulate('change', {
            target: { value: password_confirmation }
        });

        wrapper = component.find('#user_nickname');
        wrapper.simulate('change', { target: { value: nickname } });

        const instance = component.instance();
        instance.handleSignUp = jest.fn();
        instance.forceUpdate();

        wrapper = component.find('#sign_up_button');
        const event = Object.assign(jest.fn(), { preventDefault: () => {} });
        wrapper.simulate('click', event);

        expect(wrapper.props()).toHaveProperty('disabled', false);
        expect(instance.handleSignUp).toBeCalledTimes(1);
    });

    it('Navigate to Signin button should be clicked.', () => {
        const component = shallow(<SignUp />);
        const mockEvent = { preventDefault: jest.fn() };
        const instance = component.instance();
        instance.handleNavigateSignIn = jest.fn();
        instance.forceUpdate();

        let wrapper = component.find('#navigate_sign_in_button');
        wrapper.simulate('click', mockEvent);
        // expect(instance.handleNavigateSignIn).toBeCalledTimes(1);
        expect(mockEvent.preventDefault).toBeCalledTimes(1);
    });
});
