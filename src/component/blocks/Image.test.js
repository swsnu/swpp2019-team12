import React from 'react';
import { shallow, mount } from 'enzyme';
import Image from './Image';

function mockComponent(props, className) {
    return <div className={className}>{props}</div>;
}

describe('<Image />', () => {
    let image;

    // beforeEach(() => {
    //     let image;
    //     image = <Image />;
    //     component = shallow(image);
    //     instance = component.instance();
    // });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without errors', () => {
        const component = shallow(<Image setFieldValue={jest.fn()} />);
        const wrapper = component.find('.full-size-block-container');
        expect(wrapper.length).toBe(1);
    });

    it('should handle click delete', () => {
        const mockHandleDeleteBlock = jest.fn();
        const mockEvent = { preventDefault: jest.fn() };
        const component = shallow(
            <Image handleDeleteBlock={mockHandleDeleteBlock} />
        );
        const wrapper = component.find('.delete-button');
        expect(wrapper.length).toBe(1);

        wrapper.simulate('click', mockEvent);
        expect(mockHandleDeleteBlock).toHaveBeenCalledTimes(1);
        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    });

    //29.63 |    21.43 |       25 |    30.19

    it('should handle click block', () => {
        const mockHandleClickBlock = jest.fn();
        const mockEvent = { preventDefault: jest.fn() };
        const component = shallow(
            <Image handleClickBlock={mockHandleClickBlock} />
        );
        const wrapper = component.find('.full-size-block-container');
        expect(wrapper.length).toBe(1);

        wrapper.simulate('click', mockEvent);
        expect(mockHandleClickBlock).toHaveBeenCalledTimes(1);
        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(0);
    });

    // 30.19 |    21.43 |    31.25 |    30.77

    it('should handle handle submit', () => {
        const mockHandleSubmit = jest.fn();
        const mockEvent = { preventDefault: jest.fn() };
        const component = shallow(<Image handleSubmit={mockHandleSubmit} />);
        const wrapper = component.find('.image-submit');
        expect(wrapper.length).toBe(1);
    });

    it('should handle handle change', () => {});

    it('should handle handle change image', () => {});

    it('should return null with getDerivedStateFromProps', () => {
        const component = shallow(<Image content={''} />);
        const containerInstance = component.instance();
        let result = containerInstance.constructor.getDerivedStateFromProps(
            [],
            []
        );
        expect(result).toEqual([]);
    });
});
