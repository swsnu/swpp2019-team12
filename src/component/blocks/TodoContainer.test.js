import React from 'react';
import TodoContainer from './TodoContainer';
import { shallow } from 'enzyme';

describe('<TodoContainer />', () => {
    it('should render without error', () => {
        const component = shallow(<TodoContainer />);
        let wrapper = component.find('.full-size-block-container');
        expect(wrapper.length).toBe(1);
    });

    it('should set state properly after didmount', () => {
        const stubTodos = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const component = shallow(<TodoContainer todos={stubTodos} />);
        const containerInstance = component.instance();
        expect(containerInstance.state.todos.length).toBe(3);
        expect(containerInstance.state.todos[0].id).toBe(1);
    });

    it('should return null with getDerivedStateFromProps', () => {
        const givenProps = {
            todos: []
        };
        const givenState = {
            todos: []
        };
        const component = shallow(<TodoContainer todos={[]} />);
        const containerInstance = component.instance();
        let result = containerInstance.constructor.getDerivedStateFromProps(
            givenProps,
            givenState
        );
        expect(result).toEqual({ todos: [] });
    });
});
