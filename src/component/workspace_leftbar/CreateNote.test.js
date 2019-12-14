import React from 'react';
import { shallow, mount } from 'enzyme';
import CreateNote from './CreateNote';

describe('<CreateNote />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without erros', () => {
        const component = shallow(<CreateNote />);
        const wrapper = component.find('.createNote-container');
        expect(wrapper.length).toBe(1);
    });
});
