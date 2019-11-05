import React, {Component} from 'react'

class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content,
            is_done: this.props.is_done,
            assignee: this.props.assignee
        }
    }

    handleChangeTodo = () => {
        console.log("Need to implement changing todo");
    }

    handleChangeStatus = () => {
        console.log("Need to implement changing status of Todo (isDone or not)");
    }

    handleAssign = () => {
        console.log("Need to implement assigning memeber to specific Todo");
    }

    render() {
        return (
            <div className="Todo">
                <div className="todo-content">
                    <div className="todo__content">{this.state.content}</div>
                    <div className="todo__is-done">{this.state.is_done}</div>
                    <div className="todo__assignee">{this.state.assignee}</div>
                </div>
            </div>
        )
    }
}

export default Todo
