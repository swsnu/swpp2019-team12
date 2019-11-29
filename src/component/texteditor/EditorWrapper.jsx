import React, { Component } from 'react';
// import ConfigurationDialog from './configuration-dialog';
import Editor from './Editor';
import axios from 'axios';

export default class EditorWrapper extends Component {
    state = {
        selectedUser: {
            // id: this.props.currentUserProfile['id'],
            // name: this.props.currentUserProfile.nickname
            id: 1,
            name: '임시'
        },
        configuration: {
            documentId: '36ur9q8hprg',
            tokenUrl:
                'https://43733.cke-cs.com/token/dev/3TvgNvZRyzXDDc7dsBXDBuM0cFITPrq26HUfIlLHXo0Zjcwgm3nxOWSeBSU8',
            uploadUrl: 'https://43733.cke-cs.com/easyimage/upload/',
            webSocketUrl: '43733.cke-cs.com/ws'
        },
        updated: false
    };

    componentDidMount() {
        const nickname = sessionStorage.getItem('LoggedInUserNickname');
        const userId = sessionStorage.getItem('LoggedInUserId');
        console.log('세션스토리지 nickname, id: ', nickname, userId);
        const data = {
            id: userId,
            name: nickname
        };
        console.log('Set token url');
        console.log('config: ', this.state.configuration);
        let config = this.state.configuration;
        config.tokenUrl =
            `${getRawTokenUrl(config.tokenUrl)}?` +
            Object.keys(data)
                .filter(key => data[key])
                .map(key => {
                    if (key === 'role') {
                        return `${key}=${data[key]}`;
                    }

                    return `user.${key}=${data[key]}`;
                })
                .join('&');

        this.setState({
            config: config,
            updated: true,
            selectedUser: {
                id: userId,
                name: nickname
            }
        });
    }

    render() {
        // console.log('Editor Wrapper rendered');
        // console.log('에디터에서 선택된 사람', this.state.selectedUser);

        return (
            this.state.updated && (
                <Editor
                    selectedUser={this.state.selectedUser}
                    configuration={this.state.configuration}
                />
            )
        );
    }
}

function isCloudServicesTokenEndpoint(tokenUrl) {
    return /cke-cs[\w-]*\.com\/token\/dev/.test(tokenUrl);
}

function getRawTokenUrl(url) {
    if (isCloudServicesTokenEndpoint(url)) {
        return url.split('?')[0];
    }

    return url;
}
