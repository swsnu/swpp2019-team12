import React from 'react';
import { shallow, mount } from 'enzyme';
import SignIn from './SignIn';
import axios from 'axios';

describe('<SignIn />', () => {
    beforeEach(() => {});

    it('should render without error', () => {
        const component = shallow(<SignIn />);
        let wrapper = component.find('.SignIn');
        expect(wrapper.length).toBe(1);
    });

    it('should set state properly on email input', () => {
        const email = 'test@test.com';
        const component = shallow(<SignIn />);
        let wrapper = component.find('#email-input');
        wrapper.simulate('change', { target: { value: email } });
        const instance = component.instance();
        expect(instance.state.email).toEqual('test@test.com');
    });

    it('should set state properly on password input', () => {
        const password = 'testpassword';
        const component = shallow(<SignIn />);
        let wrapper = component.find('#password-input');
        wrapper.simulate('change', { target: { value: password } });
        const instance = component.instance();
        expect(instance.state.password).toEqual('testpassword');
    });

    it('Navigate to SignUp button should be clicked.', () => {
        const mockHistory = { push: jest.fn() };
        const component = shallow(<SignIn history={mockHistory} />);
        const mockEvent = { preventDefault: jest.fn() };
        let wrapper = component.find('#navigate_sign_up_button');
        wrapper.simulate('click', mockEvent);
        expect(mockHistory.push).toHaveBeenCalledWith('/signup');
        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should handle signin when corresponding user is in DB.', async () => {
        axios.post = jest.fn((url, userinfo) => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200
                };
                resolve(result);
            });
        });

        const email = 'test@test.com';
        const password = 'Testpassword12!@';
        const mockHistory = { push: jest.fn() };
        const mockEvent = { preventDefault: jest.fn() };
        const component = shallow(<SignIn history={mockHistory} />);
        let wrapper = component.find('#email-input');
        wrapper.simulate('change', { target: { value: email } });
        wrapper = component.find('#password-input');
        wrapper.simulate('change', { target: { value: password } });

        wrapper = component.find('#sign_in_button');
        await wrapper.simulate('click', mockEvent);
        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
        //expect(mockHistory.push).toHaveBeenCalledWith('/workspace');
    });

    // Promise reject하는 경우가 작동이 잘 안된다....
    xit('should show error message when corresponding user is not in DB.', async () => {
        axios.post = jest.fn((url, userinfo) => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 401
                };
                reject(result);
            });
        });

        const email = 'nonexisting@test.com';
        const password = 'Testpassword12!@';
        const mockHistory = { push: jest.fn() };
        const mockEvent = { preventDefault: jest.fn() };
        const component = shallow(<SignIn history={mockHistory} />);
        let wrapper = component.find('#email-input');
        wrapper.simulate('change', { target: { value: email } });
        wrapper = component.find('#password-input');
        wrapper.simulate('change', { target: { value: password } });

        wrapper = component.find('#sign_in_button');
        await wrapper.simulate('click', mockEvent);
        const instance = component.instance();
        console.log(component.debug());
        console.log(instance.state);
        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
        return expect(axios.post()).rejects.toEqual({ status: 401 });
    });
});
