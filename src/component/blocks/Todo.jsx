import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import { map, uniqBy, differenceBy } from 'lodash';
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
        const { todo } = this.props;
        this.setState({ assignees: todo.assignees_info, todo });
    }

    handleChangeTodo = e => {
        const { todo } = this.state;
        const content = e.target.value.length ? e.target.value : ' ';
        this.setState({ todo: { ...todo, content } }, () => {
            axios
                .patch(`/api/todo/${todo.id}`, this.state.todo)
                .then(res => {})
                .catch(e => console.log(e));
        });
    };

    handleDeleteTodo = () => {
        const { todo } = this.state;
        axios
            .delete(`/api/todo/${todo.id}`)
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
            .patch(`/api/todo/${todo.id}`, { is_done: !todo.is_done })
            .then(res => {
                this.setState({ todo: { ...todo, is_done: !todo.is_done } });
            })
            .catch(err => console.log());
    };

    handleSelectAssignee = assignee => {
        const { todo } = this.props;
        const assignees = uniqBy([...this.state.assignees, assignee], 'id');

        const assigneeInfo = {
            assignees: assignees.map(assignee => assignee.id)
        };
        axios
            .patch(`/api/todo/${todo.id}`, assigneeInfo)
            .then(res => {
                this.setState({ assignees });
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
                                    <span>{`#${todo.id}`}</span>
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
                                    <span>{`#${todo.id}`}</span>
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
