import React from 'react';
import { mount } from 'enzyme';
import EditorWrapper from './EditorWrapper';

function mockComponent(props, className) {
    return <div className={className}>{props.title}</div>;
}

jest.mock('./Editor', () =>
    jest.fn(props => mockComponent(props, 'spyEditor'))
);

describe('<EditorWrapper />', () => {
    it('should render without errors', () => {
        const component = mount(<EditorWrapper />);
        const wrapper = component.find('.EditorWrapper');
        expect(wrapper.length).toBe(1);
    });
});
