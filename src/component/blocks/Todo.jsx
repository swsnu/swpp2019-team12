import React, { Component } from 'react';
import { Menu, Dropdown, Icon, DatePicker } from 'antd';
import moment from 'moment';
import { map, uniqBy, differenceBy, find, pull, remove } from 'lodash';
import axios from 'axios';

class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignees: [],
            todo: {},
            typing: false,
            typingTimeout: 0,
            content: ''
        };

        this.inputRef = React.createRef();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.todo.assignees_info !== prevState.todo.assignees_info ||
            nextProps.todo.is_done !== prevState.todo.is_done ||
            nextProps.todo.due_date !== prevState.todo.due_date ||
            nextProps.todo.content !== prevState.todo.content ||
            nextProps.todo !== prevState.todo
        ) {
            return {
                todo: nextProps.todo,
                assignees: nextProps.todo.assignees_info,
                content: nextProps.todo.content
            };
        }
        return prevState;
    }

    componentDidMount() {
        const { todo } = this.props;
        this.setState({
            assignees: todo.assignees_info,
            todo,
            content: todo.content
        });
    }

    modifyTodoInfo = (res, todo, data, func) => {
        const noteId = this.props.noteId;
        const socketRef = this.props.socketRef;
        let childrenBlocks = JSON.parse(res['data']['children_blocks']);
        let todoContainer = find(childrenBlocks, {
            block_type: 'TodoContainer'
        });
        let originalTodos = todoContainer.todos;
        let original_todo = find(originalTodos, {
            id: todo.id
        });
        // return original_todo;

        original_todo = func(original_todo, data);

        let todoIdx = -1;
        for (let i = 0; i < originalTodos.length; i++) {
            if (originalTodos[i].id == todo.id) {
                todoIdx = i;
                break;
            }
        }

        originalTodos.splice(todoIdx, 1, original_todo);
        todoContainer.todos = originalTodos;

        let todoContainerIdx = -1;
        for (let i = 0; i < childrenBlocks.length; i++) {
            if (childrenBlocks[i]['block_type'] === 'TodoContainer') {
                todoContainerIdx = i;
                break;
            }
        }

        childrenBlocks.splice(todoContainerIdx, 1, todoContainer);

        const newBlocks = JSON.stringify(childrenBlocks);
        const stringifiedBlocks = {
            children_blocks: newBlocks
        };
        axios
            .patch(`/api/note/${noteId}/childrenblocks/`, stringifiedBlocks)
            .then(res => {
                console.log('바뀐 child', res);
                socketRef.current.state.ws.send(newBlocks);
            })
            .catch(err => console.log(err));
    };

    handleDeleteTodo = () => {
        const { todo } = this.state;
        axios
            .delete(`/api/todo/${todo.id}/`)
            .then(res => {
                this.props.handleDeleteTodo(todo);
            })
            .catch(e => console.log(e));
    };

    handleFocus = () => {
        const { todo } = this.state;
        if (!todo.is_done) this.inputRef.current.focus();
    };

    handleChangeTodo = e => {
        const noteId = this.props.noteId;
        const { todo } = this.state;
        const content = e.target.value.length ? e.target.value : ' ';

        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
        }

        this.setState({
            content: content,
            typing: false,
            typingTimeout: setTimeout(() => {
                console.log('여기다 넣을까?');
                axios
                    .patch(`/api/todo/${todo.id}/`, { content: content })
                    .then(res_1 => {
                        console.log('바뀐 todo?', res_1);
                        axios
                            .get(`/api/note/${noteId}/childrenblocks/`)
                            .then(res_2 => {
                                let todoHandleFunc = (
                                    original_todo,
                                    content
                                ) => {
                                    original_todo.content = content;
                                    return original_todo;
                                };
                                console.log(this);
                                this.modifyTodoInfo(
                                    res_2,
                                    todo,
                                    res_1['data']['content'],
                                    todoHandleFunc
                                );
                            });
                    })
                    .catch(e => console.log(e));
            }, 1818)
        });
        // this.setState({ content: content });

        // this.setState({ todo: updatedTodo }, () => {
        //     console.log('여기는 안들어오니?');
        //     axios
        //         .patch(`/api/todo/${todo.id}/`, this.state.todo)
        //         .then(res_1 => {
        //             axios
        //                 .get(`/api/note/${noteId}/childrenblocks/`)
        //                 .then(res_2 => {
        //                     let todoHandleFunc = (original_todo, content) => {
        //                         original_todo.content = content;
        //                         return original_todo;
        //                     };
        //                     this.modifyTodoInfo(
        //                         res_2,
        //                         todo,
        //                         res_1['data']['content'],
        //                         todoHandleFunc
        //                     );
        //                 });
        //         })
        //         .catch(e => console.log(e));
        // });
        // this.setState({ todo: { ...todo, content } }, () => {
        // });
        // axios
        //     .patch(`/api/todo/${todo.id}/`, { content: content })
        //     .then(res_1 => {
        //         console.log(res_1['data']['content']);
        //         axios.get(`/api/note/${noteId}/childrenblocks/`).then(res_2 => {
        //             let todoHandleFunc = (original_todo, content) => {
        //                 original_todo.content = content;
        //                 return original_todo;
        //             };
        //             this.modifyTodoInfo(
        //                 res_2,
        //                 todo,
        //                 res_1['data']['content'],
        //                 todoHandleFunc
        //             );
        //         });
        //     })
        //     .catch(e => console.log(e));
    };

    handleChangeStatus = () => {
        const noteId = this.props.noteId;
        const { todo } = this.state;
        axios
            .patch(`/api/todo/${todo.id}/`, { is_done: !todo.is_done })
            .then(res_2 => {
                axios.get(`/api/note/${noteId}/childrenblocks/`).then(res_2 => {
                    let todoHandleFunc = (original_todo, is_done) => {
                        original_todo.is_done = !is_done;
                        return original_todo;
                    };
                    this.modifyTodoInfo(
                        res_2,
                        todo,
                        todo.is_done,
                        todoHandleFunc
                    );
                });
            })
            .catch(err => console.log());
    };

    handleSelectAssignee = assignee => {
        const noteId = this.props.noteId;
        const { todo } = this.state;
        const assignees = uniqBy([...this.state.assignees, assignee], 'id');
        const assigneeInfo = {
            assignees: assignees.map(assignee => assignee.id)
        };

        axios
            .patch(`/api/todo/${todo.id}/`, assigneeInfo)
            .then(res_1 => {
                axios.get(`/api/note/${noteId}/childrenblocks/`).then(res_2 => {
                    let todoHandleFunc = (original_todo, assignee) => {
                        let doAdd = true;
                        console.log('FUNC', original_todo);
                        for (
                            let i = 0;
                            i < original_todo.assignees_info.length;
                            i++
                        ) {
                            let info = original_todo.assignees_info[i];
                            if (info.id === assignee.id) {
                                doAdd = false;
                                break;
                            }
                        }
                        if (doAdd) {
                            original_todo.assignees.push(assignee.id);
                            original_todo.assignees_info.push({
                                id: assignee.id,
                                nickname: assignee.nickname
                            });
                        }
                        return original_todo;
                    };
                    this.modifyTodoInfo(res_2, todo, assignee, todoHandleFunc);
                });
            })
            .catch(e => console.log(e));
    };

    handleDeleteAssignee = assignee => {
        const removedAssignee = differenceBy(
            this.state.assignees,
            [assignee],
            'id'
        );

        this.setState({ assignees: removedAssignee });
    };

    handleChangeDueDate = (date, dateString) => {
        const noteId = this.props.noteId;
        const { todo } = this.state;
        axios
            .patch(`/api/todo/${todo.id}/`, {
                due_date: date.format('YYYY-MM-DD')
            })
            .then(res_1 => {
                axios.get(`/api/note/${noteId}/childrenblocks/`).then(res_2 => {
                    let todoHandleFunc = (original_todo, due_date) => {
                        original_todo.due_date = due_date;
                        return original_todo;
                    };
                    this.modifyTodoInfo(
                        res_2,
                        todo,
                        res_1['data']['due_date'],
                        todoHandleFunc
                    );
                });
            })
            .catch(e => console.log(e));
    };

    assigneesDropdown = () => {
        const { participants } = this.props;
        return (
            <Menu>
                {map(participants, (participant, i) => (
                    <Menu.Item
                        key={i}
                        onClick={() => this.handleSelectAssignee(participant)}>
                        {participant.nickname}
                    </Menu.Item>
                ))}
            </Menu>
        );
    };

    render() {
        console.log(this.state);
        const { assignees, todo } = this.state;
        const dateFormat = 'YYYY-MM-DD';
        const dueDate = todo.due_date ? moment(todo.due_date) : moment();

        return (
            <div
                className="full-size-block todoCard-content-element"
                onClick={this.handleFocus}>
                <div className="full-size-block todoCard-content-element__todo between">
                    <div className="full-size-block todoCard-content-element__todo-todo-part">
                        {todo.is_done ? (
                            <div
                                className="full-size-block todoCard-content-element__checkbox-icon done"
                                onClick={this.handleChangeStatus}
                            />
                        ) : (
                            <div
                                className="full-size-block todoCard-content-element__checkbox-icon"
                                onClick={this.handleChangeStatus}
                            />
                        )}

                        {todo.is_done ? (
                            <div className="full-size-block todoCard-content-element__todo-text done">
                                <div>
                                    <span>{`#${todo.id}/`}</span>
                                </div>
                                <input
                                    className="todoCard-content-element__todo-text-content"
                                    value={this.state.content || ''}
                                    ref={this.inputRef}
                                    disabled
                                    // onChange={this.handleChangeTodo}
                                />
                            </div>
                        ) : (
                            <div className="full-size-block todoCard-content-element__todo-text">
                                <div>
                                    <span>{`#${todo.id}/`}</span>
                                </div>
                                <input
                                    className="todoCard-content-element__todo-text-content"
                                    value={this.state.content || ''}
                                    onChange={this.handleChangeTodo}
                                    ref={this.inputRef}
                                />
                            </div>
                        )}
                    </div>
                    <div className="full-size-block todoCard-content-element__todo-due-container">
                        <DatePicker
                            size="small"
                            value={dueDate}
                            format={dateFormat}
                            onChange={this.handleChangeDueDate}
                        />
                    </div>

                    <div className="full-size-block todoCard-content-element__todo-assignee-container">
                        <div className="full-size-block todoCard-content-element__todo-assignee-part">
                            {map(assignees, (assignee, i) => (
                                <div
                                    key={i}
                                    className="full-size-block todoCard-content-element__todo-assignee"
                                    onClick={() =>
                                        this.handleDeleteAssignee(assignee)
                                    }>
                                    {assignee.nickname}
                                </div>
                            ))}
                        </div>
                        <Dropdown
                            placement="bottomRight"
                            overlay={this.assigneesDropdown()}
                            trigger={['click']}>
                            <div className="ant-dropdown-link">
                                {/* <div>New</div> */}
                                <Icon type="plus-square" />
                            </div>
                        </Dropdown>
                    </div>

                    <div
                        className="full-size-block todoCard-content-element__todo-delete"
                        onClick={this.handleDeleteTodo}>
                        <Icon type="minus-circle" theme="filled" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Todo;
