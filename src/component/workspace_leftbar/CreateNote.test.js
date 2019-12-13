import React from 'react';
import { shallow } from 'enzyme';
import CreateNote from './CreateNote';

describe('<CreateNote />', () => {
    it('should render without error', () => {
        const component = shallow(<CreateNote />);
        let wrapper = component.find('.createNote-container');
        expect(wrapper.length).toBe(1);
    });
});
