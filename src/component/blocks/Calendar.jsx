import React, { Component } from 'react';
import Timeline, {
    TimelineHeaders,
    SidebarHeader,
    DateHeader
} from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';

import faker from 'faker';
import axios from 'axios';

const keys = {
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

class CreateModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: ''
        };
    }

    render() {
        const { handleAddItems } = this.props;
        const { title } = this.state;
        return (
            <div>
                <div>title</div>
                <input
                    onChange={e => this.setState({ title: e.target.value })}
                    value={title}
                />
                <button onClick={title => handleAddItems(title)}>Create</button>
            </div>
        );
    }
}

class Calendar extends Component {
    constructor(props) {
        super(props);

        // const { groups, items } = this.generateFakeData();
        const defaultTimeStart = moment()
            .startOf('month')
            .toDate();
        const defaultTimeEnd = moment()
            .startOf('month')
            .add(1, 'month')
            .toDate();

        this.state = {
            groups: [],
            items: [],
            defaultTimeStart,
            defaultTimeEnd,
            created: false,
            selected: false
        };
    }

    componentDidMount() {}

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

    itemRenderer = ({ item, itemContext, getItemProps, getResizeProps }) => {
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
                    },
                    onMouseDown: () => {
                        console.log(itemContext);
                        this.setState({
                            selected: true
                        });
                    }
                })}>
                <div {...leftResizeProps} />

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
                <div {...rightResizeProps} />
            </div>
        );
    };

    onCanvasClick = (groupId, time, e) => {
        const { items, created } = this.state;

        const newItem = {
            flag: 'temp',
            id: items.length + 1,
            group: groupId,
            title: '',
            start: time,
            // default two day
            end: time + 2 * 24 * 3600 * 1000,
            className:
                moment(time).day() === 6 || moment(time).day() === 0
                    ? 'item-weekend'
                    : '',
            itemProps: {
                'data-tip': faker.hacker.phrase()
            }
        };

        if (created) {
            this.setState(
                {
                    created: false,
                    items: this.state.items.filter(item => item.flag !== 'temp')
                },
                () =>
                    this.setState({
                        created: true,
                        items: [...this.state.items, newItem]
                    })
            );
        } else {
            this.setState({
                created: true,
                items: [...this.state.items, newItem]
            });
        }
    };

    generateFakeData = (groupCount = 10, itemCount = 100, daysInPast = 30) => {
        let groups = [];
        for (let i = 0; i < groupCount; i++) {
            groups.push({
                id: `${i + 1}`,
                title: faker.name.firstName(),
                rightTitle: faker.name.lastName()
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
                    faker.random.number({ min: 2, max: 10 }) * 12 * 3600 * 1000
            ).valueOf();

            items.push({
                id: i + '',
                group: faker.random.number({ min: 1, max: groups.length }) + '',
                title: faker.hacker.phrase(),
                start: startValue,
                end: endValue,
                className:
                    moment(startDate).day() === 6 ||
                    moment(startDate).day() === 0
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

    render() {
        const {
            groups,
            items,
            defaultTimeStart,
            defaultTimeEnd,
            selected
        } = this.state;
        return (
            <div className="full-size-block-container Calendar">
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
                    onCanvasClick={this.onCanvasClick}>
                    <TimelineHeaders className="sticky">
                        <SidebarHeader>
                            {({ getRootProps }) => {
                                return <div {...getRootProps()}>Left</div>;
                            }}
                        </SidebarHeader>
                        <DateHeader unit="primaryHeader" />
                        <DateHeader />
                    </TimelineHeaders>
                </Timeline>
            </div>
        );
    }
}

export default Calendar;
