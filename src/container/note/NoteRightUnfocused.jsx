import React, { Component } from 'react';
import axios from 'axios';
import MeetingNoteOverview from '../../component/workspace_main/MeetingNoteOverview';

export default class NoteRightUnfocused extends Component {
    constructor(props) {
        super(props);
        this.state = {
            other_notes: [],
            workspace_id: this.props.workspace_id,
            clicked_note: -1
        };
    }

    componentDidMount() {
        // 현재 노트의 형제 노트들을 모두 가져와서 state에 저장
        axios
            .get(`/api/siblingnotes/${this.props.match.params.n_id}`)
            .then(res => {
                this.setState({
                    other_notes: res.data.filter(
                        r => r.id != this.props.match.params.n_id
                    )
                });
            });
    }

    handleClick = id => {
        this.setState({
            clicked_note: id
        });
    };

    render() {
        return (
            <div className="Note-right-unfocused">
                <div className="Note-right-page-unfocused__title">
                    Note Right Unfocused
                </div>
                <MeetingNoteOverview
                    notes={this.state.other_notes}
                    handleClick={this.handleClick}
                />
                {/* <LeftNote /> */}
            </div>
        );
    }
}
