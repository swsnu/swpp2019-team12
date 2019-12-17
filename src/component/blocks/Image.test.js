import React from 'react';
import { shallow, mount } from 'enzyme';
import Image from './Image';

function mockComponent(props, className) {
    return <div className={className}>{props}</div>;
}

describe('<Image />', () => {
    let image;
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without errors', () => {
        const component = shallow(<Image setFieldValue={jest.fn()} />);
        const wrapper = component.find('.full-size-block-container');
        expect(wrapper.length).toBe(1);
    });

    it('should handle delete', () => {
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
