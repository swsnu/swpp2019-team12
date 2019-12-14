import React from 'react';
import { shallow, mount } from 'enzyme';
import SignUp from './SignUp';
import axios from 'axios';
describe('<SignUp />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

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

    it('When user enter invaild email', () => {
        const email = 'test@test.wrong.email';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_email');
        wrapper.simulate('change', { target: { value: email } });
        let instance = component.instance();
        expect(instance.state.email).toEqual('test@test.wrong.email');
        wrapper.simulate('blur');
        instance = component.instance();
        expect(instance.state.emailVaildText).toEqual('잘못된 형식입니다.');
        expect(instance.state.isEmailVaild).toEqual(false);
    });

    it('When user enter invaild email', () => {
        const email = 'test@test.wrong.email';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_email');
        wrapper.simulate('change', { target: { value: email } });
        let instance = component.instance();
        expect(instance.state.email).toEqual('test@test.wrong.email');
        wrapper.simulate('blur');
        instance = component.instance();
        expect(instance.state.emailVaildText).toEqual('잘못된 형식입니다.');
        expect(instance.state.isEmailVaild).toEqual(false);
    });

    it('When input email is not existing in DB', async () => {
        axios.patch = jest.fn((url, userinfo) => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200
                };
                resolve(result);
            });
        });
        const email = 'nonexisting@test.com';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_email');
        wrapper.simulate('change', { target: { value: email } });
        await wrapper.simulate('blur');
        const instance = component.instance();
        expect(axios.patch).toHaveBeenCalledTimes(1);
        expect(instance.state.emailVaildText).toEqual('멋진 아이디네요!');
        expect(instance.state.isEmailVaild).toEqual(true);
    });

    it('When input email is already existing in DB', async () => {
        axios.patch = jest.fn((url, userinfo) => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 204
                };
                resolve(result);
            });
        });
        const email = 'existing@test.com';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_email');
        wrapper.simulate('change', { target: { value: email } });
        await wrapper.simulate('blur');
        const instance = component.instance();
        expect(axios.patch).toHaveBeenCalledTimes(1);
        expect(instance.state.emailVaildText).toEqual(
            '이미 동일한 아이디가 존재합니다.'
        );
        expect(instance.state.isEmailVaild).toEqual(false);
    });

    it('should set state properly on password input', () => {
        const password = 'testpassword';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_password');
        wrapper.simulate('change', { target: { value: password } });
        const instance = component.instance();
        expect(instance.state.password).toEqual('testpassword');
    });

    it('When user enter vaild password', () => {
        const password = 'Vaildpassword12!@';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_password');
        wrapper.simulate('change', { target: { value: password } });
        wrapper.simulate('blur');
        const instance = component.instance();
        expect(instance.state.isPwVaild).toEqual(true);
        expect(instance.state.pwVaildText).toEqual('');
    });

    it('When user enter invaild password', () => {
        const password = 'invaildpassword';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_password');
        wrapper.simulate('change', { target: { value: password } });
        wrapper.simulate('blur');
        const instance = component.instance();
        expect(instance.state.isPwVaild).toEqual(false);
        expect(instance.state.pwVaildText).toEqual(
            '대문자 소문자 최소 1개, 길이 8 이상'
        );
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

    it('When password_conf is same as password', () => {
        const password = 'VaildPassword12!@';
        const password_confirmation = 'VaildPassword12!@';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_password');
        wrapper.simulate('change', { target: { value: password } });

        wrapper = component.find('#user_password_confirmation');
        wrapper.simulate('change', {
            target: { value: password_confirmation }
        });
        wrapper.simulate('blur');
        const instance = component.instance();
        expect(instance.state.isPwConfirmationVaild).toEqual(true);
        expect(instance.state.pwConfirmationVaildText).toEqual('');
    });

    it('When password_conf is different from password', () => {
        const password = 'vaildpassword';
        const password_confirmation = 'differentpassword';
        const component = shallow(<SignUp />);
        let wrapper = component.find('#user_password');
        wrapper.simulate('change', { target: { value: password } });

        wrapper = component.find('#user_password_confirmation');
        wrapper.simulate('change', {
            target: { value: password_confirmation }
        });
        wrapper.simulate('blur');
        const instance = component.instance();
        expect(instance.state.isPwConfirmationVaild).toEqual(false);
        expect(instance.state.pwConfirmationVaildText).toEqual(
            '비밀번호가 일치하지 않습니다.'
        );
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
        const mockHistory = { push: jest.fn() };
        const component = shallow(<SignUp history={mockHistory} />);
        const mockEvent = { preventDefault: jest.fn() };
        let wrapper = component.find('#navigate_sign_in_button');
        wrapper.simulate('click', mockEvent);
        expect(mockHistory.push).toHaveBeenCalledWith('/signin');
        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should submit form when all inputs are vaild', async done => {
        axios.post = jest.fn((url, user_info) => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {
                        nickname: 'test',
                        id: 1
                    }
                };
                resolve(result);
            });
        });

        axios.patch = jest.fn((url, userinfo) => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200
                };
                resolve(result);
            });
        });
        sessionStorage = { setItem: jest.fn() };

        const email = 'test@test.com';
        const password = 'TestPassword12!@';
        const password_confirmation = 'TestPassword12!@';
        const nickname = 'testNickName';
        const mockHistory = { push: jest.fn() };
        const component = shallow(<SignUp history={mockHistory} />);
        const mockEvent = { preventDefault: jest.fn() };

        let wrapper = component.find('#user_email');
        wrapper.simulate('change', { target: { value: email } });
        wrapper.simulate('blur');

        wrapper = component.find('#user_password');
        wrapper.simulate('change', { target: { value: password } });
        await wrapper.simulate('blur');

        wrapper = component.find('#user_password_confirmation');
        wrapper.simulate('change', {
            target: { value: password_confirmation }
        });
        await wrapper.simulate('blur');

        wrapper = component.find('#user_nickname');
        wrapper.simulate('change', { target: { value: nickname } });

        wrapper = component.find('#sign_up_button');
        await wrapper.simulate('click', mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(mockHistory.push).toHaveBeenCalled();
        // expect(sessionStorage.setItem).toHaveBeenCalled();
        //expect(mockHistory.push).toHaveBeenCalledWith('/signin');
        done();
    });

    it('should not submit form when some inputs are invaild', async () => {
        axios.post = jest.fn((url, user_info) => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200
                };
                resolve(result);
            });
        });

        axios.patch = jest.fn((url, userinfo) => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 204
                };
                resolve(result);
            });
        });

        const email = 'test@test.com';
        const password = 'TestPassword12!@';
        const password_confirmation = 'TestPassword12!@';
        const nickname = 'testNickName';
        const mockHistory = { push: jest.fn() };
        const component = shallow(<SignUp history={mockHistory} />);
        const mockEvent = { preventDefault: jest.fn() };

        let wrapper = component.find('#user_email');
        wrapper.simulate('change', { target: { value: email } });
        await wrapper.simulate('blur');

        wrapper = component.find('#user_password');
        wrapper.simulate('change', { target: { value: password } });
        wrapper.simulate('blur');

        wrapper = component.find('#user_password_confirmation');
        wrapper.simulate('change', {
            target: { value: password_confirmation }
        });
        wrapper.simulate('blur');

        wrapper = component.find('#user_nickname');
        wrapper.simulate('change', { target: { value: nickname } });

        wrapper = component.find('#sign_up_button');
        await wrapper.simulate('click', mockEvent);
        expect(axios.post).toHaveBeenCalledTimes(0);
        expect(mockHistory.push).toHaveBeenCalledTimes(0);
    });
});
