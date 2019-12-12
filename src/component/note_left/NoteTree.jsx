import React, { Component } from 'react';
import TreeMenu from 'react-simple-tree-menu';

export default class NoteTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blocks: [],
            treeData: [],
            agendaChildrenBlocks: []
        };
    }
    componentDidMount() {
        const blocks = this.props.blocks;
        this.setState({
            treeData: changeBlocksToTree(this.props, blocks)
        });
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.blocks !== prevState.blocks ||
            nextProps.agendaChildrenBlocks !== prevState.agendaChildrenBlocks
        ) {
            const treeData = changeBlocksToTree(nextProps, nextProps.blocks);
            return { blocks: nextProps.blocks, treeData: treeData };
        }
        return null;
    }

    render() {
        return (
            <div>
                <TreeMenu data={this.state.treeData} />
            </div>
        );
    }
}

const changeBlocksToTree = (props, blocks) => {
    let treeData = [];
    blocks.forEach(blk => {
        let data;
        if (blk.block_type == 'Agenda') {
            let childrenDatas = [];
            if (props.agendaChildrenBlocks) {
                childrenDatas = props.agendaChildrenBlocks.find(childBlk => {
                    return childBlk.id == blk.id;
                });
            }
            // console.log('childrenDatas: ', childrenDatas);
            let childrenNodes = [];
            if (childrenDatas && childrenDatas.childrenBlocks) {
                childrenDatas.childrenBlocks.forEach(childBlk => {
                    childrenNodes.push({
                        key: childBlk.block_type + childBlk.id,
                        label: childBlk.block_type + childBlk.id
                    });
                });
            }

            data = {
                key: blk.block_type + blk.id,
                label: blk.block_type + blk.id,
                nodes: childrenNodes
            };
        } else {
            data = {
                key: blk.block_type + blk.id,
                label: blk.block_type + blk.id
            };
        }
        treeData.push(data);
    });
    return treeData;
};
