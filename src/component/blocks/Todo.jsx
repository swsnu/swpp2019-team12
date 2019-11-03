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
            <div className="full-size-block-container Todo">
                <div className="full-size-block-title">
                    <div className="full-size-block-title__text">Todo</div>
                </div>
                <div className="full-size-block-content">
                    <div className="full-size-block-content__text">{this.state.content}</div>
                </div>
            </div>
        )
    }
}

export default Todo
