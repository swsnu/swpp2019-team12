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

const mockHandleAddAgendaBlock = jest.fn();
const mockHandleAddTextBlock = jest.fn();
const mockHandleAddTodoBlock = jest.fn();
const mockHandleAddImageBlock = jest.fn();
const mockBlocks = [
    {
        block_type: 'Text',
        id: 1
    },
    {
        block_type: 'TodoContainer',
        id: 2
    },
    {
        block_type: 'Agenda',
        id: 3
    },
    {
        block_type: 'Image',
        id: 4
    }
];
describe('<NoteLeftBlock />', () => {
    let noteLeftBlock;
    beforeEach(() => {
        noteLeftBlock = (
            <NoteLeftBlock
                handleAddImageBlock={mockHandleAddImageBlock}
                handleAddAgendaBlock={mockHandleAddAgendaBlock}
                handleAddTodoBlock={mockHandleAddTodoBlock}
                handleAddTextBlock={mockHandleAddTextBlock}
                blocks={mockBlocks}
            />
        );
    });
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
        let stubBlocks = [
            {
                block_type: 'Text',
                id: 1
            }
        ];
        let stubNewBlocks = [
            {
                block_type: 'Text',
                id: 1
            },
            {
                block_type: 'Agenda',
                id: 2
            }
        ];
        const c = shallow(<NoteLeftBlock blocks={stubBlocks} />);
        instance = c.instance();
        instance.setState({
            blocks: [
                {
                    block_type: 'Text',
                    id: 1
                }
            ]
        });
        result = instance.constructor.getDerivedStateFromProps(
            stubNewBlocks,
            stubBlocks
        );
        expect(result).toBe(null);
        stubBlocks = [
            {
                block_type: 'Agenda',
                id: 3
            }
        ];
        stubNewBlocks = [
            {
                block_type: 'Text',
                id: 2
            },
            {
                block_type: 'Agenda',
                id: 3
            }
        ];
        const d = shallow(<NoteLeftBlock blocks={stubBlocks} />);
        instance = d.instance();
        instance.setState({
            blocks: stubBlocks
        });
        result = instance.constructor.getDerivedStateFromProps(
            stubNewBlocks,
            stubBlocks
        );
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

    it('handle add agenda', () => {
        const component = shallow(noteLeftBlock);
        let addAgendaButton = component.find('#add_agenda_block');
        addAgendaButton.simulate('click');
        expect(mockHandleAddAgendaBlock).toHaveBeenCalledTimes(1);
    });

    it('handle add text', () => {
        const component = shallow(noteLeftBlock);
        let addAgendaButton = component.find('#add_text_block');
        addAgendaButton.simulate('click');
        expect(mockHandleAddTextBlock).toHaveBeenCalledTimes(1);
    });

    it('handle add todo', () => {
        const component = shallow(noteLeftBlock);
        let addAgendaButton = component.find('#add_todo_block');
        addAgendaButton.simulate('click');
        expect(mockHandleAddTodoBlock).toHaveBeenCalledTimes(1);
    });

    it('handle add image', () => {
        const component = shallow(noteLeftBlock);
        let addAgendaButton = component.find('#add_image_block');
        addAgendaButton.simulate('click');
        expect(mockHandleAddImageBlock).toHaveBeenCalledTimes(1);
    });
});
