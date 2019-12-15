import React from 'react';
import { shallow } from 'enzyme';
import Text from './Text';

function mockComponent(props, className) {
    return <div className={className}>{props}</div>;
}

jest.mock('../texteditor/EditorWrapper', () =>
    jest.fn(props => mockComponent(props, 'spyEditorWrapper'))
);

describe('<Text />', () => {
    let text;
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without errors', () => {
        const component = shallow(<Text />);
        const wrapper = component.find('.full-size-block-container');
        expect(wrapper.length).toBe(1);
    });

    it('should handle delete', () => {
        const mockHandleDeleteBlock = jest.fn();
        const mockEvent = { preventDefault: jest.fn() };
        const component = shallow(
            <Text handleDeleteBlock={mockHandleDeleteBlock} />
        );
        const wrapper = component.find('.delete-button');
        expect(wrapper.length).toBe(1);

        wrapper.simulate('click', mockEvent);
        expect(mockHandleDeleteBlock).toHaveBeenCalledTimes(1);
        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    });
});
