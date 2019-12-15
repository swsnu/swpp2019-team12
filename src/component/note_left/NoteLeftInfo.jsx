import React, { Component } from 'react';
import moment from 'moment';
import DateTime from 'react-datetime';
import { Label } from './Label';
import ParticipantInfo from './ParticipantInfo';
import Tag from '../blocks/Tag';
import { Button, Menu, Dropdown, Icon } from 'antd';
import axios from 'axios';

class NoteLeftInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTitleClicked: false,
            isDateClicked: false,
            isLocationClicked: false,
            noteTags: this.props.noteTags,
            workspaceTags: this.props.workspaceTags
        };
    }

    handleConvertTag_Title = () => {
        this.setState({ isTitleClicked: !this.state.isTitleClicked });
    };

    handleConvertTag_Datetime = () => {
        this.setState({ isDateClicked: !this.state.isDateClicked });
    };
    handleConvertTag_Location = () => {
        this.setState({ isLocationClicked: !this.state.isLocationClicked });
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.noteTags != prevState.noteTags ||
            nextProps.workspaceTags != prevState.workspaceTags
        ) {
            return {
                noteTags: nextProps.noteTags,
                workspaceTags: nextProps.workspaceTags
            };
        }
        return null;
    }

    renderTags = () => {
        return (
            this.state.noteTags &&
            this.state.noteTags.map((tag, i) => <Tag key={i} tag={tag} />)
        );
    };

    handleMenuClick = e => {
        console.log(e);
        this.props.handleAddTag(e.key);
    };

    render() {
        const menu = (
            <Menu>
                {this.state.workspaceTags.map((tag, i) => (
                    <Menu.Item key={tag.id} onClick={this.handleMenuClick}>
                        {tag.content}
                    </Menu.Item>
                ))}
            </Menu>
        );
        return (
            <div className="NoteLeftInfo">
                <div className="NoteLeftInfo-title__container">
                    <div className="NoteLeftInfo__currentNote">
                        <Label title="Meeting Note Title" isTitle />
                        <input
                            className="form-control title"
                            type="text"
                            value={this.props.note_title}
                            // onBlur가 되면 Update API call
                            onBlur={this.handleConvertTag_Title}
                            onChange={this.props.handleChangeTitle}
                        />
                    </div>
                </div>
                <div>
                    <div className="NoteLeftInfo-data-participant__container">
                        <div className="NoteLeftInfo-date__container">
                            <Label title="Meeting Date & Time" />
                            <DateTime
                                value={this.props.moment}
                                onBlur={this.handleConvertTag_Datetime}
                                onChange={this.props.handleChangeDatetime}
                            />
                            <Label title="Location" />
                            <input
                                className="form-control location"
                                type="text"
                                value={this.props.location}
                                // onBlur가 되면 Update API call
                                onBlur={this.handleConvertTag_Location}
                                onChange={this.props.handleChangeLocation}
                            />
                        </div>
                        {/* <ParticipantInfo participants={this.props.participants} /> */}
                        <ParticipantInfo
                            isRightUnfocused={this.props.isRightUnfocused}
                            participants={this.props.participants}
                        />
                    </div>
                </div>
                <div className="NoteLeftInfo-tags">
                    <Label title="Labels" />
                    <div className="Tags-container">
                        <Dropdown overlay={menu} className="add-tag-button">
                            <Button>
                                라벨 추가 <Icon type="down" />
                            </Button>
                        </Dropdown>
                        <div className="Tags-list">{this.renderTags()}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NoteLeftInfo;
