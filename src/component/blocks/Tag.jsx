import React, { Component } from 'react';
import axios from 'axios';
import { Tag as AntTag } from 'antd';
import { height } from 'dom-helpers';

export default class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tagId: this.props.tag.id,
            title: this.props.tag.content,
            color: this.props.tag.color
        };
    }

    render() {
        console.log(this.props);
        return <AntTag color={this.state.color}>{this.state.title}</AntTag>;
    }
}
