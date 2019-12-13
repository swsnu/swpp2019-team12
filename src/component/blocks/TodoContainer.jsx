import React, { Component } from 'react';
import { map } from 'lodash';
import Todo from './Todo';

class TodoContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: []
        };
    }
    componentDidMount() {
        this.setState({ todos: this.props.todos });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.todos !== prevState.todos) {
            return { todos: nextProps.todos };
        }
        return null;
    }

    // handleDeleteTodo = deleted => {
    //     const { todos } = this.state;
    //     const filtered = todos.filter(todo => todo.id !== deleted.id);
    //     this.setState({ todos: filtered });
    // };

    render() {
        return (
            <div
                className="full-size-block-container TodoContainer"
                id="Todo"
                onClick={this.props.handleClickBlock}>
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
                    {map(this.state.todos, todo => (
                        <Todo
                            key={todo.id}
                            todo={todo}
                            noteId={this.props.noteId}
                            participants={this.props.participants}
                            handleDeleteTodo={this.props.handleDeleteTodo}
                            socketRef={this.props.socketRef}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default TodoContainer;
