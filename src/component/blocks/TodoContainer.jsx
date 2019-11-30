import React, { Component } from "react";
import { map } from "lodash";

class TodoContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: this.props.todos
        };
    }

    handleToggleTodo = todo_id => {};

    render() {
        return (
            <div
                className="full-size-block-container TodoContainer"
                onClick={this.props.handleClickBlock}
            >
                <div className="full-size-block-title">
                    <div className="full-size-block-title__text">Todos</div>
                </div>
                <div className="full-size-block-subtitle">
                    <div className="full-size-block--subtitle__todo">Todo</div>
                    <div className="full-size-block--subtitle__assignees">
                        Assignees
                    </div>
                </div>
                <div className="full-size-block todoCard-content-container">
                    {map(this.props.todos, (todo, i) => (
                        <div
                            key={i}
                            className="full-size-block todoCard-content-element"
                        >
                            <div className="full-size-block todoCard-content-element__todo between">
                                <div className="full-size-block todoCard-content-element__todo-todo-part">
                                    {todo.is_done ? (
                                        <div
                                            className="full-size-block todoCard-content-element__checkbox-icon done"
                                            onClick={() =>
                                                this.handleToggleTodo(todo.id)
                                            }
                                        />
                                    ) : (
                                        <div
                                            className="full-size-block todoCard-content-element__checkbox-icon"
                                            onClick={() =>
                                                this.handleToggleTodo(todo.id)
                                            }
                                        />
                                    )}

                                    {todo.is_done ? (
                                        <div className="full-size-block todoCard-content-element__todo-text done">
                                            <span>{`#${todo.id}`}</span>
                                            {`${todo.content}`}
                                        </div>
                                    ) : (
                                        <div className="full-size-block todoCard-content-element__todo-text">
                                            <span>{`#${todo.id}`}</span>
                                            {`${todo.content}`}
                                        </div>
                                    )}
                                </div>
                                <div className="full-size-block todoCard-content-element__todo-assignee-part">
                                    <div className="full-size-block todoCard-content-element__todo-assignee">
                                        {map(
                                            todo.assignees_info,
                                            (info, i) => info["nickname"] + " "
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default TodoContainer;
