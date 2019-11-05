import React, {Component} from 'react'
import {map} from 'lodash';

class TodoContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: this.props.todos,
        }
    }

    handleToggleTodo = (todo_id) => {

    }

    render() {
        return (
            <div 
                className="full-size-block-container TodoContainer"
                onClick={this.props.handleClickBlock}    
            >
                <div className="full-size-block-title">
                    <div className="full-size-block-title__text">Todos</div>
                </div>
                <div className="full-size-block-content">
                    <div className="full-size-block todoCard-content-container">
                        {map(this.state.todos, (todo, i) => (
                            <div key={i} className="full-size-block todoCard-content-element">
                                <div className="full-size-block todoCard-content-element__todo">
                                    {todo.is_done ? (
                                        <div
                                            className="full-size-block todoCard-content-element__checkbox-icon done"
                                            onClick={() => this.handleToggleTodo(todo.id)}
                                        />
                                    ) : (
                                        <div
                                            className="full-size-block todoCard-content-element__checkbox-icon"
                                            onClick={() => this.handleToggleTodo(todo.id)}
                                        />
                                    )}

                                    {todo.is_done ? (
                                        <div
                                            className="full-size-block todoCard-content-element__todo-text done"
                                            >
                                            <span>{`#${todo.id}`}</span>
                                            {`${todo.content}`}
                                        </div>
                                    ) : (
                                        <div
                                            className="full-size-block todoCard-content-element__todo-text"
                                            >
                                            <span>{`#${todo.id}`}</span>
                                            {`${todo.content}`}
                                        </div>
                                    )}
                                    <div className="full-size-block todoCard-content-element__todo-assignee">{todo.assignee}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default TodoContainer
