import React, { Component } from 'react';
import TreeMenu from 'react-simple-tree-menu';

export default class NoteTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blocks: [],
            treeData: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.blocks !== prevState.blocks) {
            const treeData = changeBlocksToTree(nextProps, nextProps.blocks);
            return { blocks: nextProps.blocks, treeData: treeData };
        }
        return null;
    }

    render() {
        return (
            <div>
                <TreeMenu
                    className="tree-menu"
                    data={this.state.treeData}
                    onClickItem={item => {
                        const targetId = `#${item.type}-${item.index}`;
                        const target = document.querySelector(targetId);
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                        //this.props.history.push(targetId);
                    }}
                />
            </div>
        );
    }
}

const changeBlocksToTree = (props, blocks) => {
    let treeData = [];
    blocks.forEach(blk => {
        let data;
        if (blk.block_type == 'Agenda') {
            data = {
                key: '[' + blk.block_type + '] ' + blk.content + blk.id,
                label: '[' + blk.block_type + '] ' + blk.content,
                type: blk.block_type
            };
        } else {
            data = {
                key: '[' + blk.block_type + '] ' + blk.id,
                type: blk.block_type,
                label: '[' + blk.block_type + ']'
            };
        }
        treeData.push(data);
    });
    return treeData;
};
