import React from 'react';
import { shallow } from 'enzyme';
import Agenda from './Agenda';
import axios from 'axios';

function mockComponent(props, className) {
    return <div className={className}>{props.title}</div>;
}

const stubWorkspaceTags = [1, 2];
const stubWorkspaceId = 1;
const stubNoteId = 1;
const stubBlk_id = 1;
const stubType = 'Text';
const stubContent = 'Test content';
const stubAgendaDiscussion = 'Test discusssion';
const stubHandleClickBlock = jest.fn();
const stubHandleDeleteBlock = jest.fn(
    (axios_path, block_type, agenda_id) => {}
);
const stubSocketRef = { current: null };
const stubParticipants = [{ id: 1, nickname: 'TEST_USER' }];

jest.mock('../agenda_in/AgendaInside', () =>
    jest.fn(props => mockComponent(props, 'spyAgendaInside'))
);

describe('<Agenda />', () => {
    let agenda;
    beforeEach(() => {
        agenda = (
            <Agenda
                workspaceTags={stubWorkspaceTags}
                workspaceId={stubWorkspaceId}
                noteId={stubNoteId}
                blk_id={stubBlk_id}
                type={stubType}
                content={stubContent}
                agenda_discussion={stubAgendaDiscussion}
                handleClickBlock={stubHandleClickBlock}
                handleDeleteBLock={stubHandleDeleteBlock}
                socketRef={stubSocketRef}
                participants={stubParticipants}
            />
        );

        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {
                        agenda: {
                            children_blocks: '',
                            content: 'STUB_CONTENT'
                        },
                        tags: ['STUB_TAG']
                    }
                };
                resolve(result);
            });
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without error', () => {
        const component = shallow(agenda);
        let wrapper = component.find('#Agenda-Container');
        expect(wrapper.length).toBe(1);
    });

    it('ComponentDidMount', () => {
        const component = shallow(agenda);
        const instance = component.instance();
        instance.componentDidMount();
        axios.get('', res => {
            instance.setState({
                blocks: res.data.agenda.children_blocks,
                current_title: res.data.agenda.content,
                tags: res.data.tags
            });
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(instance.state.blocks).toEqual([]);
            expect(instance.current_title).toEqual('STUB_CONTENT');
            expect(instance.agendaTags).toEqual(['STUB_TAG']);
        });
    });

    it('ComponentDidMount when children_blocks exists ', () => {
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {
                        agenda: {
                            children_blocks: 'TEST_CHILDREN_BLOCK',
                            content: 'STUB_CONTENT'
                        },
                        tags: ['STUB_TAG']
                    }
                };
                resolve(result);
            });
        });
        JSON.parse = jest.fn(data => {
            return 'PARSED_DATA';
        });
        const component = shallow(agenda);
        const instance = component.instance();
        instance.componentDidMount();
        axios.get('', res => {
            instance.setState({
                blocks: res.data.agenda.children_blocks,
                current_title: res.data.agenda.content,
                tags: res.data.tags
            });
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(instance.state.blocks).toEqual('PARSED_DATA');
        });
    });

    it('handleClickDelete ', () => {
        const component = shallow(agenda);
        const instance = component.instance();

        instance.handleClickDelete = jest.fn();
        instance.forceUpdate();

        let wrapper = component.find('.delete-button');
        wrapper.simulate('click');
        console.log(component.props());
        expect(component.props().handleClickDelete).toHaveBeenCalledTimes(1);
        expect(component.props().handleClickDelete).toHaveBeenCalledWith(
            `/api/agenda/${instance.state.agenda_id}/`,
            'Agenda',
            instance.state.agenda_id
        );
        expect(instance.handleClickDelete).toHaveBeenCalledTimes(1);
    });

    it('handleChangeAgendaTitle ', () => {
        const component = shallow(agenda);
        const title = 'TEST_TITLE';

        let wrapper = component.find('.agenda-title-input');
        wrapper.simulate('change', { target: { value: title } });
        const instance = component.instance();
        expect(instance.state.current_title).toEqual('TEST_TITLE');
    });

    it('handleAddTextBlock ', () => {
        const component = shallow(agenda);

        const instance = component.instance();
        instance.handleAddTextBlock = jest.fn();
        instance.forceUpdate();
        let wrapper = component.find('.agenda-add-text-button');
        wrapper.simulate('click');
        expect(instance.handleAddTextBlock).toHaveBeenCalledTimes(1);
    });

    it('handleAddImageBlock ', () => {
        const component = shallow(agenda);

        const instance = component.instance();
        instance.handleAddImageBlock = jest.fn();
        instance.forceUpdate();
        let wrapper = component.find('.agenda-add-image-button');
        wrapper.simulate('click');
        expect(instance.handleAddImageBlock).toHaveBeenCalledTimes(1);
    });

    it('handleAddTodoBlock ', () => {
        const component = shallow(agenda);

        const instance = component.instance();
        instance.handleAddTodoBlock = jest.fn();
        instance.forceUpdate();
        let wrapper = component.find('.agenda-add-todo-button');
        wrapper.simulate('click');
        expect(instance.handleAddTodoBlock).toHaveBeenCalledTimes(1);
    });
});
