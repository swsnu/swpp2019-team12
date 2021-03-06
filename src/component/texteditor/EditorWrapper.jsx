import React, { Component } from 'react';
import Editor from './Editor';

export default class EditorWrapper extends Component {
    state = {
        selectedUser: {
            id: 1,
            name: '임시'
        },
        configuration: {
            document_id: '36ur9q8hprg',
            // 토큰 만료 주의
            tokenUrl:
                'https://43733.cke-cs.com/token/dev/3TvgNvZRyzXDDc7dsBXDBuM0cFITPrq26HUfIlLHXo0Zjcwgm3nxOWSeBSU8',
            uploadUrl: 'https://43733.cke-cs.com/easyimage/upload/',
            webSocketUrl: '43733.cke-cs.com/ws'
        },
        updated: false
    };

    /* 
    [열어야 하는 Editor configuration 정의]
    - props로 전달된 document Id
    - 로그인한 유저로 토큰 url 재설정
    - updated = True
    */
    componentDidMount() {
        const nickname = sessionStorage.getItem('LoggedInUserNickname');
        const userId = sessionStorage.getItem('LoggedInUserId');
        const data = {
            id: userId,
            name: nickname
        };

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
        config.document_id = this.props.document_id;

        this.setState({
            configuration: config,
            updated: true,
            selectedUser: {
                id: userId,
                name: nickname
            }
        });
    }

    render() {
        return (
            <div
                className={`EditorWrapper ${
                    this.props.loading ? '--blur' : ''
                }`}>
                {/* <p>{this.state.configuration.document_id}</p> */}

                <Editor
                    handleLoading={this.props.handleLoading}
                    selectedUser={this.state.selectedUser}
                    configuration={this.state.configuration}
                    document_id={this.props.document_id}
                    blk_id={this.props.blk_id}
                />
            </div>
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
