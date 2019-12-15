import React, { Component } from 'react';
import { Tag as AntTag } from 'antd';

export default class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.tag.content,
            color: this.props.tag.color
        };
    }

    render() {
        return (
            <AntTag className="ant-tag" color={this.state.color}>
                {this.state.title}
            </AntTag>
        );
    }
}
