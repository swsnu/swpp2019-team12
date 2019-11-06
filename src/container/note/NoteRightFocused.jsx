import React, { Component } from 'react';
import PreviewAgenda from '../../component/blocks/PreviewAgenda';
import Text from '../../component/blocks/Text';
import TodoContainer from '../../component/blocks/Todo';
import axios from 'axios';

class NoteRightFocused extends Component {
    constructor(props) {
        super(props);
        this.state = {
            block_id: -1,
            block_type: null,
            note_id: this.props.note_id,
            content: ''
        };
    }

    componentWillUnmount() {
        console.log('unmount');
    }

    handleOnBlur = () => {
        console.log('handleOnBlur');
        const data = {
            content: this.state.content
        };
        axios
            .patch(
                `/api/${this.state.block_type}/${this.state.block_id}/`,
                data
            )
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        let block_focused = null;
        const block_data = this.props.blocks.filter(
            t =>
                t.id === this.props.block_focused_id &&
                t.block_type === this.props.block_focused_name
        );
        if (
            block_data.length > 0 &&
            (this.state.block_type !== block_data[0].block_type ||
                this.state.block_id !== block_data[0].id)
        ) {
            block_focused = block_data[0];

            this.setState({
                content: block_focused.content,
                block_type: block_focused.block_type,
                block_id: block_focused.id
            });
        }

        let block_focused_box;
        let block_name;
        if (this.state.block_type && this.state.block_type === 'textblock') {
            block_focused_box = (
                <input
                    type="text"
                    value={this.state.content}
                    onBlur={() => this.handleOnBlur()}
                    onChange={e => {
                        this.setState({
                            content: e.target.value
                        });
                    }}
                />
            );
        } else if (
            this.state.block_type &&
            this.state.block_type === 'agenda'
        ) {
            block_focused_box = (
                <input
                    type="text"
                    value={this.state.content}
                    onBlur={() => this.handleOnBlur()}
                    onChange={e => {
                        this.setState({
                            content: e.target.value
                        });
                    }}
                />
            );
        } else if (
            this.state.block_type &&
            this.state.block_type === 'TodoContainer'
        ) {
            block_focused_box = (
                <input
                    type="text"
                    value={this.state.content}
                    onChange={e => {
                        this.setState({
                            content: e.target.value
                        });
                    }}
                />
            );
        }

        block_name = this.state.block_type;

        return (
            <div
                className="Note-right"
                onClick={this.props.handleClickNoteLeft}>
                <div className="Note-right-page__title">Note Right Focused</div>
                <div className="Note-right-page__line" />
                <div className="Note-right-container">
                    <div className="Note-right-focused__title">
                        {block_name}
                    </div>
                    <div className="NoteRightBlock__block">
                        {block_focused_box}
                    </div>
                </div>
            </div>
        );
    }
}

export default NoteRightFocused;
