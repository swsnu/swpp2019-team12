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
        console.log('didmount props', this.props);
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
            console.log(treeData);
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
    console.log('changeBlocks: ', blocks);
    let treeData = [];
    blocks.forEach(blk => {
        let data;
        if (blk.block_type == 'Agenda') {
            console.log(props);
            let childrenDatas = [];
            if (props.agendaChildrenBlocks) {
                childrenDatas = props.agendaChildrenBlocks.find(data => {
                    return data.id == blk.id;
                });
            }
            console.log('childrenDatas: ', childrenDatas);
            let childrenNodes = [];
            if (childrenDatas && childrenDatas.childrenBlocks) {
                childrenDatas.childrenBlocks.forEach(cb => {
                    console.log(cb);
                    childrenNodes.push({
                        key: cb.block_type + cb.id,
                        label: cb.block_type + cb.id
                    });
                });
            }
            // let childrenNodes =
            //     childrenDatas &&
            //     childrenDatas.agendaChildrenBlocks.map(cd => {
            //         console.log(cd);
            //         return {
            //             key: cd.block_type + cd.id,
            //             label: cd.block_type + cd.id
            //         };
            //     });

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
    console.log(treeData);
    return treeData;
};
