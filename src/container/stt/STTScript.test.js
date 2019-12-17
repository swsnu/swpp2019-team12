import React from 'react';
import { shallow } from 'enzyme';
import STTScript from './STTScript';

const stubScript = [
    {
        id: 1
    }
];

describe('<STTScript />', () => {
    it('should render properly', () => {
        const component = shallow(<STTScript scripts={stubScript} />);
        let instance = component.instance();
        instance.setState({
            scripts: [
                {
                    id: 1
                }
            ]
        });
        let wrapper = component.find('.stt-script-container');
        expect(wrapper.length).toBe(1);
    });
    it('should ');
});
