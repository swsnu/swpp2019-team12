import React from 'react';
import Tag from './Tag';
import { shallow } from 'enzyme';

describe('<Tag />', () => {
    it('should render without error', () => {
        const stubTag = {
            content: 'content',
            color: '#222222'
        };

        const component = shallow(<Tag tag={stubTag} />);
        let wrapper = component.find('.ant-tag');
        expect(wrapper.length).toBe(1);
    });
});
