import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

describe('<App />', () => {
    it('should render without error', () => {
        const component = shallow(<App />);
        let wrapper = component.find('.App');
        expect(wrapper.length).toBe(1);
    });
});
