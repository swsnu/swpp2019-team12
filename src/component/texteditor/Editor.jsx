/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import PresenceList from '@ckeditor/ckeditor5-real-time-collaboration/src/presencelist';
import RealTimeCollaborativeComments from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativecomments';
import RealTimeCollaborativeTrackChanges from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativetrackchanges';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';

const initialData = `
	<h2>텍스트 입력하는 부분</h2>
`;

export default class Sample extends Component {
    state = {
        // You need this state to render the <CKEditor /> component after the layout is ready.
        // <CKEditor /> needs HTMLElements of `Sidebar` and `PresenceList` plugins provided through
        // the `config` property and you have to ensure that both are already rendered.
        isLayoutReady: false
    };

    sidebarElementRef = React.createRef();
    presenceListElementRef = React.createRef();

    componentDidMount() {
        // When the layout is ready you can switch the state and render the `<CKEditor />` component.
        this.setState({ isLayoutReady: true });
    }

    render() {
        return (
            <div className="App">
                {this.renderHeader()}

                <main>
                    <div className="message">
                        <div className="centered"></div>
                    </div>

                    <div className="centered">
                        <div className="row-presence">
                            <div
                                ref={this.presenceListElementRef}
                                className="presence"></div>
                        </div>
                        {this.renderEditor()}
                    </div>
                </main>

                {this.renderFooter()}
            </div>
        );
    }

    renderHeader() {
        return (
            <header>
                <p>Header 렌더되는 부분</p>
            </header>
        );
    }

    renderEditor() {
        // You should contact CKSource to get the CloudServices configuration.
        const cloudServicesConfig = this.props.configuration;

        return (
            <div className="row row-editor">
                {/* Do not render the <CKEditor /> component before the layout is ready. */}
                {this.state.isLayoutReady && (
                    <CKEditor
                        onInit={editor => {
                            console.log('Editor is ready to use!', editor);

                            // Switch between inline and sidebar annotations according to the window size.
                            this.boundRefreshDisplayMode = this.refreshDisplayMode.bind(
                                this,
                                editor
                            );
                            // Prevent closing the tab when any action is pending.
                            this.boundCheckPendingActions = this.checkPendingActions.bind(
                                this,
                                editor
                            );

                            window.addEventListener(
                                'resize',
                                this.boundRefreshDisplayMode
                            );
                            window.addEventListener(
                                'beforeunload',
                                this.boundCheckPendingActions
                            );
                            this.refreshDisplayMode(editor);
                        }}
                        onChange={(event, editor) =>
                            console.log({ event, editor })
                        }
                        onReady={this.onEditorReady}
                        editor={ClassicEditor}
                        config={{
                            plugins: [
                                Alignment,
                                Autoformat,
                                BlockQuote,
                                Bold,
                                CKFinder,
                                EasyImage,
                                Essentials,
                                FontFamily,
                                FontSize,
                                Heading,
                                Highlight,
                                Image,
                                ImageCaption,
                                ImageResize,
                                ImageStyle,
                                ImageToolbar,
                                ImageUpload,
                                Italic,
                                Link,
                                List,
                                MediaEmbed,
                                Paragraph,
                                PasteFromOffice,
                                PresenceList,
                                RealTimeCollaborativeComments,
                                RealTimeCollaborativeTrackChanges,
                                RemoveFormat,
                                Strikethrough,
                                Table,
                                TableToolbar,
                                Underline,
                                UploadAdapter
                            ],
                            toolbar: [
                                'heading',
                                '|',
                                'fontsize',
                                'fontfamily',
                                '|',
                                'bold',
                                'italic',
                                '|',
                                'alignment',
                                '|',
                                'numberedList',
                                'bulletedList',
                                '|',
                                'link',
                                'blockquote',
                                '|',
                                'undo',
                                'redo',
                                '|',
                                'comment',
                                '|',
                                'trackChanges'
                            ],
                            cloudServices: {
                                tokenUrl: cloudServicesConfig.tokenUrl,
                                uploadUrl: cloudServicesConfig.uploadUrl,
                                webSocketUrl: cloudServicesConfig.webSocketUrl,
                                documentId: cloudServicesConfig.documentId
                            },
                            image: {
                                toolbar: [
                                    'imageStyle:full',
                                    'imageStyle:side',
                                    '|',
                                    'imageTextAlternative',
                                    '|',
                                    'comment'
                                ]
                            },
                            table: {
                                contentToolbar: [
                                    'tableColumn',
                                    'tableRow',
                                    'mergeTableCells'
                                ],
                                tableToolbar: ['comment']
                            },
                            mediaEmbed: {
                                toolbar: ['comment']
                            },
                            sidebar: {
                                container: this.sidebarElementRef.current
                            },
                            presenceList: {
                                container: this.presenceListElementRef.current
                            }
                        }}
                        data={initialData}
                    />
                )}
                <div ref={this.sidebarElementRef} className="sidebar"></div>
            </div>
        );
    }

    renderFooter() {
        return (
            <footer>
                <div className="centered">
                    <p>footer 위치하는 곳</p>
                </div>
            </footer>
        );
    }

    refreshDisplayMode(editor) {
        const annotations = editor.plugins.get('Annotations');
        const sidebarElement = this.sidebarElementRef.current;

        if (window.innerWidth < 1070) {
            sidebarElement.classList.remove('narrow');
            sidebarElement.classList.add('hidden');
            annotations.switchTo('inline');
        } else if (window.innerWidth < 1300) {
            sidebarElement.classList.remove('hidden');
            sidebarElement.classList.add('narrow');
            annotations.switchTo('narrowSidebar');
        } else {
            sidebarElement.classList.remove('hidden', 'narrow');
            annotations.switchTo('wideSidebar');
        }
    }

    checkPendingActions(editor, domEvt) {
        if (editor.plugins.get('PendingActions').hasAny) {
            domEvt.preventDefault();
            domEvt.returnValue = true;
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.boundRefreshDisplayMode);
        window.removeEventListener(
            'beforeunload',
            this.boundCheckPendingActions
        );
    }
}
