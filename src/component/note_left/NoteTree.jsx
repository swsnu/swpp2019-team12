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
                <TreeMenu className="tree-menu" data={this.state.treeData} />
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
                key: '[' + blk.block_type + '] ' + blk.content,
                label: '[' + blk.block_type + '] ' + blk.content
            };
        } else {
            data = {
                key: '[' + blk.block_type + '] ' + blk.id,
                label: '[' + blk.block_type + ']'
            };
        }
        treeData.push(data);
    });
    return treeData;
};
