import React from 'react';
import { shallow, mount } from 'enzyme';
import Text from './Text';

// function mockComponent(props, className) {
//     return <div className={className}>{props.title}</div>;
// }

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

    it('should handle ');
});
