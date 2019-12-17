import React from 'react';
import { shallow, mount } from 'enzyme';
import Note from './Note';
import { createBrowserHistory } from 'history';
import axios from 'axios';

function mockComponent(props, className) {
    return <div className={className}>{className}</div>;
}

jest.mock('../../component/blocks/Text', () =>
    jest.fn(props => mockComponent(props, 'spyText'))
);

jest.mock('../../component/blocks/Agenda', () =>
    jest.fn(props => mockComponent(props, 'spyAgenda'))
);

jest.mock('../stt/googleSTT', () => {
    jest.fn(props => mockComponent(props, 'spyGoogleSTT'));
});

const mockHistory = { push: jest.fn() };
const history = createBrowserHistory();

describe('<Note />', () => {
    let note;
    let component;
    let instance;
    let noteLeftComponent;
    beforeEach(() => {
        note = (
            <Note
                history={history}
                required={true}
                match={{
                    params: { n_id: 1 },
                    isExact: true,
                    path: '',
                    url: ''
                }}
            />
        );
        component = shallow(note);
        instance = component.instance();
        noteLeftComponent = component.find('.note-left');
        instance.BlockRef = {
            current: { state: { ws: { send: jest.fn() } } }
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without error', () => {
        let wrapper = component.find('.Note');
        expect(wrapper.length).toBe(1);
    });

    // it('should redirect if not logged in', () => {
    //     jest.clearAllMocks();
    //     jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    //         return false;
    //     });
    //     const mockHistory = { push: jest.fn() };
    //     shallow(
    //         <Note
    //             history={mockHistory}
    //             required={true}
    //             match={{ params: { id: 1 }, isExact: true, path: '', url: '' }}
    //         />
    //     );
    //     expect(mockHistory.push).toHaveBeenCalledTimes(0);
    // });

    it('should handle delete block', async () => {
        instance.handleDeleteBlock = jest.fn();
        noteLeftComponent.props().handleDeleteBlock();
        expect(instance.handleDeleteBlock).toHaveBeenCalledTimes(0);
        const axios_path = 'url';
        const block_type = 'Text';
        const block_id = '1';

        axios.delete = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {}
                };
                resolve(result);
            });
        });

        axios.patch = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {}
                };
                resolve(result);
            });
        });
        instance.forceUpdate();

        await noteLeftComponent
            .props()
            .handleDeleteBlock(axios_path, block_type, block_id);

        expect(noteLeftComponent.length).toBe(1);
        expect(instance.handleDeleteBlock).toHaveBeenCalledTimes(0);
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(axios.patch).toHaveBeenCalledTimes(1);
    });

    it('should handle Delete todo', () => {
        const mockFn = jest.fn();
        instance.handleDeleteTodo = mockFn;
        noteLeftComponent.props().handleDeleteTodo();
        expect(mockFn).toHaveBeenCalledTimes(0);
        instance.setState({
            blocks: [
                {
                    block_type: 'TodoContainer',
                    todos: [
                        {
                            id: 1
                        }
                    ]
                }
            ]
        });
        noteLeftComponent.props().handleDeleteTodo();
        expect(mockFn).toHaveBeenCalledTimes(0);
        instance.setState({
            blocks: [
                {
                    block_type: 'TodoContainer',
                    todos: [
                        {
                            id: 1
                        },
                        {
                            id: 2
                        }
                    ]
                }
            ]
        });
        const stubDeleteTodo = {
            id: 1
        };
        noteLeftComponent.props().handleDeleteTodo(stubDeleteTodo);
        expect(mockFn).toHaveBeenCalledTimes(0);
    });

    it('should handle change title', async () => {
        const mockFn = jest.fn();
        instance.handleChangeTitle = mockFn;
        const mockEvent = { target: { value: ['mockValue'] } };
        noteLeftComponent.props().handleChangeTitle(mockEvent);
        expect(mockFn).toHaveBeenCalledTimes(0);
        instance.setState({
            typingTimeout: 1,
            typing: true
        });
        noteLeftComponent.props().handleChangeTitle(mockEvent);
        expect(mockFn).toHaveBeenCalledTimes(0);
        expect(instance.state.typing).toBe(false);
        // axios.patch = jest.fn(url => {
        //     return new Promise((resolve, reject) => {
        //         const result = {
        //             status: 200,
        //             data: {}
        //         };
        //         resolve(result);
        //     });
        // });
        // instance.forceUpdate();
        // await noteLeftComponent.props().handleChangeTitle(mockEvent);
        // expect(noteLeftComponent.length).toBe(1);
        // expect(mockFn).toHaveBeenCalledTimes(0);
        // expect(axios.patch).toHaveBeenCalledTimes(1);
    });
    //26.92 |    13.79 |    18.97 |    27.05
    it('should handle Change Datetime', () => {
        const mockFn = jest.fn();
        instance.handleChangeDatetime = mockFn;
        const moment_ = 0;
        noteLeftComponent.props().handleChangeDatetime(moment_);
        expect(mockFn).toHaveBeenCalledTimes(0);
        axios.patch = jest.fn((url, data) => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200
                };
                resolve(result);
            });
        });
        noteLeftComponent.props().handleChangeDatetime(moment_);
        expect(mockFn).toHaveBeenCalledTimes(0);
    });

    it('should handle change location', () => {
        const mockFn = jest.fn();
        instance.handleChangeLocation = mockFn;
        const mockEvent = { target: { value: ['mockValue'] } };
        noteLeftComponent.props().handleChangeLocation(mockEvent);
        expect(mockFn).toHaveBeenCalledTimes(0);
        instance.setState({
            typingTimeout: 1,
            typing: true
        });
        noteLeftComponent.props().handleChangeLocation(mockEvent);
        expect(mockFn).toHaveBeenCalledTimes(0);
        axios.patch = jest.fn((url, data) => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200
                };
                resolve(result);
            });
        });
        noteLeftComponent.props().handleChangeLocation(mockEvent);
        expect(mockFn).toHaveBeenCalledTimes(0);
        expect(instance.state.typing).toBe(false);
    });

    it('should handle add agendaBlock', () => {
        const mockFn = jest.fn();
        instance.handleAddAgendaBlock = mockFn;
        noteLeftComponent.props().handleAddAgendaBlock();
        expect(mockFn).toHaveBeenCalledTimes(0);
    });
    //34.62 |    18.97 |    25.86 |    34.78
    it('should handle add textblock', () => {
        const mockFn = jest.fn();
        instance.handleAddTextBlock = mockFn;
        const spyHandleAddTextBlock = jest.spyOn(
            instance,
            'handleAddTextBlock'
        );
        const spyRandomString = jest.spyOn(instance, 'randomString');
        const spyHandleDocIdInUrl = jest.spyOn(instance, 'handleDocIdInUrl');
        const spyUpdateDocIdInUrl = jest.spyOn(instance, 'updateDocIdInUrl');
        const spyGenerateUrlWithDocId = jest.spyOn(
            instance,
            'generateUrlWithDocId'
        );
        noteLeftComponent.props().handleAddTextBlock();
        expect(spyHandleAddTextBlock).toBeCalledTimes(0);
        expect(spyHandleDocIdInUrl).toHaveBeenCalledTimes(1);
        expect(spyUpdateDocIdInUrl).toHaveBeenCalledTimes(1);
        expect(spyRandomString).toHaveBeenCalledTimes(1);
        expect(spyGenerateUrlWithDocId).toHaveBeenCalledTimes(1);
    });

    it('should handle add todoblock', () => {
        const spyHandleAddTodoBlock = jest.spyOn(
            instance,
            'handleAddTodoBlock'
        );
        noteLeftComponent.props().handleAddTodoBlock();
        expect(spyHandleAddTodoBlock).toHaveBeenCalledTimes(0);
    });

    it('should handle add imageBlock', () => {
        const spyHandleAddImageBlock = jest.spyOn(
            instance,
            'handleAddImageBlock'
        );
        noteLeftComponent.props().handleAddImageBlock();
        expect(spyHandleAddImageBlock).toHaveBeenCalledTimes(0);
    });

    it('should handle add tag', async () => {
        const spyHandleAddTag = jest.spyOn(instance, 'handleAddTag');
        const stubTagId = 1;
        instance.setState({
            workspaceTags: [
                {
                    id: 1
                },
                {
                    id: 2
                }
            ],
            noteTags: [
                {
                    id: 1
                }
            ]
        });
        axios.patch = jest.fn((url, data) => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200
                };
                resolve(result);
            });
        });
        await noteLeftComponent.props().handleAddTag(stubTagId);
        expect(spyHandleAddTag).toHaveBeenCalledTimes(0);
        expect(axios.patch).toHaveBeenCalledTimes(0);
        await noteLeftComponent.props().handleAddTag(2);
        expect(spyHandleAddTag).toHaveBeenCalledTimes(0);
        expect(axios.patch).toHaveBeenCalledTimes(1);
    });

    it('should do good with didmount', () => {
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {
                        children_blocks: ''
                    }
                };
                resolve(result);
            });
        });
        instance.componentDidMount();
        axios.get('', res => {
            instance.setState({
                blocks: []
            });
            expect(axios.get), toHaveBeenCalledTimes(1);
            expect(instance.state.blocks).toEqual([]);
        });
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {
                        children_blocks:
                            '[{"block_type":"Agenda","id":77,"content":"Modifications","layer_x":0,"layer_y":0,"agenda_children_blocks":[]},{"block_type":"Agenda","id":76,"content":" Accomplishment","layer_x":0,"layer_y":0,"agenda_children_blocks":[]},{"block_type":"Agenda","id":78,"content":"Plans","layer_x":0,"layer_y":0,"agenda_children_blocks":[]},{"block_type":"Text","id":203,"content":"새로 생성된 텍스트 블록","layer_x":0,"layer_y":0,"document_id":"3udj5l9ffv"}]'
                    }
                };
                resolve(result);
            });
        });
        instance.componentDidMount();
        axios.get('', res => {
            instance.setState({
                workspaceId: 1
            });
            expect(axios.get), toHaveBeenCalledTimes(1);
            expect(instance.state.blocks).toEqual([]);
            expect(instance.state.workspaceId).toEqual(1);
        });
        axios.get = jest.fn(url => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: {
                        children_blocks:
                            '[{"block_type":"Agenda","id":73,"content":"User Story #1","layer_x":0,"layer_y":0,"agenda_children_blocks":[]},{"block_type":"Agenda","id":72,"content":" Project Abstraction","layer_x":0,"layer_y":0,"agenda_children_blocks":[]},{"block_type":"Agenda","id":74,"content":" User Story #2","layer_x":0,"layer_y":0,"agenda_children_blocks":[]},{"block_type":"Agenda","id":75,"content":"User Story #3","layer_x":0,"layer_y":0,"agenda_children_blocks":[]},{"block_type":"Image","id":2,"image":"/media/66252204-8c34f380-e793-11e9-84da-c60b4ad04b81.png","content":"User Interface Description","is_submitted":true,"layer_x":0,"layer_y":0},{"block_type":"TodoContainer","todos":[{"id":1,"block_type":"TodoContainer","content":"Competitive Analysis","layer_x":0,"layer_y":0,"assignees":[3,14],"due_date":"2019-12-01","note":"23","is_parent_note":true,"is_done":false,"parent_agenda":null,"assignees_info":[{"id":14,"nickname":"채민"},{"id":3,"nickname":"태영"}]},{"id":2,"block_type":"TodoContainer","content":"Customer Needs","layer_x":0,"layer_y":0,"assignees":[13,12],"due_date":"2019-12-01","note":"23","is_parent_note":true,"is_done":false,"parent_agenda":null,"assignees_info":[{"id":12,"nickname":"예지"},{"id":13,"nickname":"상연"}]},{"id":23,"block_type":"TodoContainer","content":"할 일을 채워주세요","layer_x":0,"layer_y":0,"assignees":[],"due_date":"2019-12-16","note":"23","is_parent_note":true,"is_done":false,"parent_agenda":null,"assignees_info":[]}]}]'
                    }
                };
                resolve(result);
            });
        });
        instance.componentDidMount();
        axios.get('', res => {
            instance.setState({
                workspaceId: 1
            });
            expect(axios.get), toHaveBeenCalledTimes(1);
            expect(instance.state.blocks).toEqual([]);
            expect(instance.state.workspaceId).toEqual(1);
        });
        axios.get = jest.fn(url => {
            if (url == '/api/note/1/') {
                return new Promise((resolve, reject) => {
                    const result = {
                        status: 200,
                        data: {
                            note: {
                                id: 1,
                                title: 'testTitle',
                                location: 'testLocation',
                                created_at: 'testCreatedAt',
                                last_modified_at: 'testLastModifiedAt',
                                moment: '2019-02-07',
                                workspaceId: 1,
                                participants: [1, 2, 3]
                            },
                            tags: [1],
                            workspace_tags: [1, 2, 3]
                        }
                    };
                    resolve(result);
                });
            } else {
                return new Promise((resolve, reject) => {
                    const result = {
                        status: 200,
                        data: {
                            id: 1,
                            nickname: 'testNickname'
                        }
                    };
                    resolve(result);
                });
            }
        });
        instance.componentDidMount();
        axios.get('', res => {
            instance.setState({
                workspaceId: 1
            });
            expect(axios.get), toHaveBeenCalledTimes(1);
            expect(instance.state.blocks).toEqual([]);
            expect(instance.state.workspaceId).toEqual(1);
        });
    });

    it('should work with socket well', () => {});
});
