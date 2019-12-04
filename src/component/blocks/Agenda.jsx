import React, { Component } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
class Agenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agenda_id: this.props.id,
            agenda_title: this.props.agenda_title,
            agenda_discussion: this.props.agenda_discussion
        };
    }

    handleClickDelete = e => {
        e.preventDefault();
        axios
            .delete(`/api/agenda/${this.state.agenda_id}`)
            .then(res => {
                console.log('res.data:' + res.data);
                window.location.reload();
            })
            .catch(err => {
                console.log('err: ' + err);
            });
    };

    handleClickToDetail = () => {
        console.log(
            'Need to implement changing to Detail mode from preview mode'
        );
    };

    render() {
        return (
            <div
                className="full-size-block-container PreviewAgenda"
                onClick={() =>
                    this.props.handleClickBlock(
                        this.props.type,
                        this.props.blk_id
                    )
                }>
                <div className="full-size-block-title PreviewAgenda">
                    <div className="full-size-block-title__label PreviewAgenda">
                        Agenda
                    </div>
                    <button
                        onClick={this.handleClickDelete}
                        className="delete-button">
                        X
                    </button>
                </div>
                <div className="full-size-block-content PreviewAgenda">
                    <div className="full-size-block-content__text PreviewAgenda">
                        <pre>{this.props.content}</pre>
                    </div>
                </div>
            </div>
        );
    }
}

export default Agenda;
