import React from 'react';
import { shallow, mount } from 'enzyme';
import Image from './Image';

describe('<Image />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should render without errors', () => {
        const component = shallow(<Image setFieldValue={jest.fn()} />);
        const wrapper = component.find('.Image');
        expect(wrapper.length).toBe(2);
    });
    it('should call handleClick when clicked', () => {
        const component = mount(<Image setFieldValue={jest.fn()} />);
        const wrapper = component.find('.Image');
        wrapper.simulate('click');
        const instance = component.instance();
        const spyHandleClick = jest
            .spyOn(instance, 'handleClick')
            .mockImplementation(() => null);
        instance.handleClick();
        expect(spyHandleClick).toHaveBeenCalledTimes(1);
    });
});
