import React from 'react';
import { shallow, mount } from 'enzyme';
import NoteLeftBlock from './NoteLeftBlock';

function mockComponent(props, className) {
    return <div className={className}>{props.title}</div>;
}

jest.mock('../blocks/Text', () =>
    jest.fn(props => mockComponent(props, 'spyText'))
);

jest.mock('../blocks/Agenda', () =>
    jest.fn(props => mockComponent(props, 'spyAgenda'))
);

describe('<NoteLeftBlock />', () => {
    it('should render without error', () => {
        const component = shallow(<NoteLeftBlock />);
        let wrapper = component.find('.NoteLeftBlock-container');
        expect(wrapper.length).toBe(1);
    });

    it('should set state properly with getDerivedStateFromProps', () => {
        const component = shallow(<NoteLeftBlock />);
        let instance = component.instance();
        let result = instance.constructor.getDerivedStateFromProps([], []);
        expect(result).toBe(null);
    });

    it('should work draggable properly', () => {
        const component = mount(<NoteLeftBlock />);
        let instance = component.instance();
        instance.setState({
            noteId: 1,
            blocks: [
                {
                    block_type: 'Text',
                    id: 1
                }
            ]
        });
        instance.forceUpdate();
        let droppableWrapper = component.find('.droppable');
        let draggableWrapper = component.find('.draggable');
        let a = component.find('.NoteLeftBlock__blockList');
        let draggableDivWrapper = component.find('.draggable-div');
        // let blockListWrapper = component.find('.');
        expect(droppableWrapper.length).toBe(0);
        expect(draggableWrapper.length).toBe(0);
        expect(a.length).toBe(1);
        expect(draggableDivWrapper.length).toBe(0);
    });
    // it('should work draggable properly', () => {
    //     const component = mount(
    //         <NoteLeftBlock
    //             blocks={[
    //                 {
    //                     block_type: 'Text',
    //                     id: 1
    //                 }
    //             ]}
    //         />
    //     );
    //     const draggable = component.find('Connect(Draggable)').first();
    //     const inner = shallow(draggable.prop('children').find(Text));
    //     expect(inner).toMatchSnapshot();
    // });
});
