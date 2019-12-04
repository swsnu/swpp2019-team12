import React, { Component } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';

import faker from 'faker';
// import randomColor from "randomcolor";

var keys = {
    groupIdKey: 'id',
    groupTitleKey: 'title',
    groupRightTitleKey: 'rightTitle',
    itemIdKey: 'id',
    itemTitleKey: 'title',
    itemDivTitleKey: 'title',
    itemGroupKey: 'group',
    itemTimeStartKey: 'start',
    itemTimeEndKey: 'end',
    groupLabelKey: 'title'
};

class Calendar extends Component {
    constructor(props) {
        super(props);

        const { groups, items } = generateFakeData();
        const defaultTimeStart = moment()
            .startOf('day')
            .toDate();
        const defaultTimeEnd = moment()
            .startOf('day')
            .add(1, 'day')
            .toDate();

        this.state = {
            groups,
            items,
            defaultTimeStart,
            defaultTimeEnd
        };
    }

    handleItemMove = (itemId, dragTime, newGroupOrder) => {
        const { items, groups } = this.state;

        const group = groups[newGroupOrder];

        this.setState({
            items: items.map(item => {
                if (item.id === itemId) {
                    return Object.assign({}, item, {
                        start: dragTime,
                        end: dragTime + (item.end - item.start),
                        group: group.id
                    });
                } else return item;
            })
        });

        console.log('Moved', itemId, dragTime, newGroupOrder);
    };

    handleItemResize = (itemId, time, edge) => {
        const { items } = this.state;

        this.setState({
            items: items.map(item => {
                if (item.id === itemId) {
                    return Object.assign({}, item, {
                        start: edge === 'left' ? time : item.start,
                        end: edge === 'left' ? item.end : time
                    });
                } else return item;
            })
        });

        console.log('Resized', itemId, time, edge);
    };

    itemRenderer = ({
        item,
        timelineContext,
        itemContext,
        getItemProps,
        getResizeProps
    }) => {
        const {
            left: leftResizeProps,
            right: rightResizeProps
        } = getResizeProps();
        const backgroundColor = itemContext.selected
            ? itemContext.dragging
                ? '#1d60aa'
                : '#1d60aa'
            : '#4a4a4a';
        const borderColor = itemContext.selected ? '#8896b0' : '#4a4a4a';
        return (
            <div
                {...getItemProps({
                    style: {
                        backgroundColor,
                        color: '#ffffff',
                        borderColor,
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderRadius: 4
                        // borderLeftWidth: itemContext.selected ? 5 : 5,
                        // borderRightWidth: itemContext.selected ? 5 : 5
                    },
                    onMouseDown: () => {
                        console.log('on item click', item);
                    }
                })}>
                {itemContext.useResizeHandle ? (
                    <div {...leftResizeProps} />
                ) : null}

                <div
                    style={{
                        height: itemContext.dimensions.height,
                        overflow: 'hidden',
                        paddingLeft: 3,
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                    {itemContext.title}
                </div>

                {itemContext.useResizeHandle ? (
                    <div {...rightResizeProps} />
                ) : null}
            </div>
        );
    };

    render() {
        const { groups, items, defaultTimeStart, defaultTimeEnd } = this.state;
        return (
            <div
                className="full-size-block-container Calendar"
                // onClick={this.props.handleClickBlock}
            >
                <div className="full-size-block-title">
                    <div className="full-size-block-title__text">Calendar</div>
                </div>
                <Timeline
                    groups={groups}
                    items={items}
                    keys={keys}
                    fullUpdate
                    itemTouchSendsClick={false}
                    stackItems
                    itemHeightRatio={0.75}
                    canMove={true}
                    canResize={'both'}
                    defaultTimeStart={defaultTimeStart}
                    defaultTimeEnd={defaultTimeEnd}
                    itemRenderer={this.itemRenderer}
                    onItemMove={this.handleItemMove}
                    onItemResize={this.handleItemResize}
                />

                {/* <div className="full-size-block-content">
                    <div className="full-size-block-content__text">
                        {this.state.content}
                    </div>
                </div> */}
            </div>
        );
    }
}

export default Calendar;

const generateFakeData = (
    groupCount = 30,
    itemCount = 1000,
    daysInPast = 30
) => {
    let randomSeed = Math.floor(Math.random() * 1000);
    let groups = [];
    for (let i = 0; i < groupCount; i++) {
        groups.push({
            id: `${i + 1}`,
            title: faker.name.firstName(),
            rightTitle: faker.name.lastName()
            // bgColor: randomColor({ luminosity: "light", seed: randomSeed + i })
        });
    }

    let items = [];
    for (let i = 0; i < itemCount; i++) {
        const startDate =
            faker.date.recent(daysInPast).valueOf() +
            daysInPast * 0.3 * 86400 * 1000;
        const startValue =
            Math.floor(moment(startDate).valueOf() / 10000000) * 10000000;
        const endValue = moment(
            startDate +
                faker.random.number({ min: 2, max: 20 }) * 15 * 60 * 1000
        ).valueOf();

        items.push({
            id: i + '',
            group: faker.random.number({ min: 1, max: groups.length }) + '',
            title: faker.hacker.phrase(),
            start: startValue,
            end: endValue,
            // canMove: startValue > new Date().getTime(),
            // canResize: 'both',
            className:
                moment(startDate).day() === 6 || moment(startDate).day() === 0
                    ? 'item-weekend'
                    : '',
            itemProps: {
                'data-tip': faker.hacker.phrase()
            }
        });
    }

    items = items.sort((a, b) => b - a);

    return { groups, items };
};
