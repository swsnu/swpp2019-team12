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
            todo: {}
        };

        this.inputRef = React.createRef();
    }

    componentDidMount() {
        console.log('todo didmount');
        const { todo } = this.props;
        console.log('todo: ', todo);
        console.log('Socket', this.props.socketRef);
        this.setState({ assignees: todo.assignees_info, todo });
    }

    handleChangeTodo = e => {
        const { todo } = this.state;
        const content = e.target.value.length ? e.target.value : ' ';
        this.setState({ todo: { ...todo, content } }, () => {
            axios
                .patch(`/api/todo/${todo.id}/`, this.state.todo)
                .then(res => {})
                .catch(e => console.log(e));
        });
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

    handleChangeStatus = () => {
        const { todo } = this.state;
        axios
            .patch(`/api/todo/${todo.id}/`, { is_done: !todo.is_done })
            .then(res => {
                this.setState({ todo: { ...todo, is_done: !todo.is_done } });
            })
            .catch(err => console.log());
    };

    handleSelectAssignee = assignee => {
        const noteId = this.props.noteId;
        const socketRef = this.props.socketRef;
        const { todo } = this.state;
        console.log('ASSIGNEES', this.state.assignees);
        const assignees = uniqBy([...this.state.assignees, assignee], 'id');

        const assigneeInfo = {
            assignees: assignees.map(assignee => assignee.id)
        };
        axios
            .patch(`/api/todo/${todo.id}/`, assigneeInfo)
            .then(res => {
                axios.get(`/api/note/${noteId}/childrenblocks/`).then(res => {
                    let childrenBlocks = JSON.parse(
                        res['data']['children_blocks']
                    );
                    console.log('childrenblks:', childrenBlocks);
                    let todoContainer = find(childrenBlocks, {
                        block_type: 'TodoContainer'
                    });
                    let originalTodos = todoContainer.todos;
                    let original_todo = find(originalTodos, {
                        id: todo.id
                    });
                    console.log('todoContaner', todoContainer);
                    console.log('originalTodos', originalTodos);
                    console.log('original_todo', original_todo);

                    original_todo.assignees.push(assignee.id);
                    original_todo.assignees_info.push({
                        id: assignee.id,
                        nickname: assignee.nickname
                    });
                    let todoIdx = -1;
                    for (let i = 0; i < originalTodos.length; i++) {
                        if (originalTodos[i].id == todo.id) {
                            todoIdx = i;
                            break;
                        }
                    }
                    console.log('original_todo 변화', original_todo);
                    originalTodos.splice(todoIdx, 1, original_todo);
                    console.log('originalTodos 변화', originalTodos);
                    console.log('todoIdx', todoIdx);

                    todoContainer.todos = originalTodos;

                    let todoContainerIdx = -1;
                    for (let i = 0; i < childrenBlocks.length; i++) {
                        if (
                            childrenBlocks[i]['block_type'] === 'TodoContainer'
                        ) {
                            todoContainerIdx = i;
                            break;
                        }
                    }

                    console.log(todoContainerIdx);
                    childrenBlocks.splice(todoContainerIdx, 1, todoContainer);
                    console.log('변화 후 ', childrenBlocks);

                    const newBlocks = JSON.stringify(childrenBlocks);
                    const stringifiedBlocks = {
                        children_blocks: newBlocks
                    };
                    axios
                        .patch(
                            `/api/note/${noteId}/childrenblocks/`,
                            stringifiedBlocks
                        )
                        .then(res => {
                            socketRef.current.state.ws.send(newBlocks);
                        })
                        .catch(err => console.log(err));
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
        const { todo } = this.state;
        axios
            .patch(`/api/todo/${todo.id}/`, {
                due_date: date.format('YYYY-MM-DD')
            })
            .then(res => {
                this.setState({
                    todo: { ...todo, due_date: date.format('YYYY-MM-DD') }
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
                                    value={todo.content || ''}
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
                                    value={todo.content || ''}
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
