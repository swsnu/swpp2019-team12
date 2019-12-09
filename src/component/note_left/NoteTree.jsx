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
    componentDidMount() {
        console.log('didmount props', this.props);
        const blocks = this.props.blocks;
        this.setState({
            treeData: changeBlocksToTree(this.props, blocks)
        });
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.blocks !== prevState.blocks) {
            const treeData = changeBlocksToTree(nextProps, nextProps.blocks);
            console.log('props: ', nextProps);
            console.log(treeData);
            return { blocks: nextProps.blocks, treeData: treeData };
        }
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
    console.log('changeBlocks: ', blocks);
    let treeData = [];
    blocks.forEach(blk => {
        console.log('blk: ', blk);
        let data;
        if (blk.block_type == 'Agenda') {
            console.log(props);
            let childrenDatas = [];
            if (props.agendaChildrenBlocks.childrenBlocks) {
                childrenDatas = props.agendaChildrenBlocks.childrenBlocks.filter(
                    data => {
                        return data.id == blk.id;
                    }
                );
            }

            data = {
                key: blk.block_type + blk.id,
                label: blk.block_type + blk.id,
                nodes: childrenDatas
            };
        } else {
            data = {
                key: blk.block_type + blk.id,
                label: blk.block_type + blk.id
            };
        }
        treeData.push(data);
    });
    console.log(treeData);
    return treeData;
};
