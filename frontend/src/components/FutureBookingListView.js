import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { Table, Tooltip } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone, LoadingOutlined } from '@ant-design/icons';

import { apiConfig } from "../config/config";
import UserContext from '../context/usercontext';


class UserFutureBookings extends React.Component {
    static contextType = UserContext;

    state = {
        history: null,
    };

    columns = [
        {
            title: 'Booking Date',
            dataIndex: 'booking_date',
            width: 150,
            fixed: 'left',
            sorter: (a, b) => moment(a['booking_date']) - moment(b['booking_date']),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Room Number',
            dataIndex: 'room_number',
            sorter: (a, b) => a['room_number'] - b['room_number'],
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Room Name',
            dataIndex: 'room_name',
            sorter: (a, b) => a['room_name'].length - b['room_name'].length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Start Time',
            dataIndex: 'start_timing',
            sorter: (a, b) => moment(a['start_timing'], 'HH:mm').diff(moment(b['start_timing'], 'HH:mm')),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'End Time',
            dataIndex: 'end_timing',
            sorter: (a, b) => moment(a['end_timing'], 'HH:mm').diff(moment(b['end_timing'], 'HH:mm')),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Purpose of Booking',
            dataIndex: 'purpose_of_booking',
            sorter: (a, b) => a['purpose_of_booking'].length - b['purpose_of_booking'].length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Admin Feedback',
            dataIndex: 'admin_feedback',
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Admin Action',
            dataIndex: 'admin_did_accept',
            fixed: 'right',
            width: 75,
        },
    ];

    componentDidMount() {
        const config = {
            headers: { Authorization: `Token ${this.context.token}` },
        };
        axios.get(`${apiConfig.baseUrl}user/bookings/future`, config).then((res) => {
            for (var i in res.data) {
                if (res.data[i]['admin_did_accept']) {
                    res.data[i]['admin_did_accept'] = (
                        <Tooltip title="Request Accepted" color="green">
                            <CheckCircleTwoTone twoToneColor="green" />
                        </Tooltip>
                    );
                    res.data[i]['is_pending'] = (
                        <Tooltip title="Request Accepted" color="green">
                            <CloseCircleTwoTone twoToneColor="green" />
                        </Tooltip>
                    );
                } else if (res.data[i]['is_pending']) {
                    res.data[i]['admin_did_accept'] = (
                        <Tooltip title="Request in Queue" color="gray">
                            <LoadingOutlined />
                        </Tooltip>
                    );
                    res.data[i]['is_pending'] = (
                        <Tooltip title="Request in Queue" color="gold">
                            <CheckCircleTwoTone twoToneColor="gold" />
                        </Tooltip>
                    );
                } else {
                    res.data[i]['admin_did_accept'] = (
                        <Tooltip title="Request Denied" color="red">
                            <CloseCircleTwoTone twoToneColor="red" />
                        </Tooltip>
                    );
                    res.data[i]['is_pending'] = (
                        <Tooltip title="Request Denied" color="red">
                            <CloseCircleTwoTone twoToneColor="red" />
                        </Tooltip>
                    );
                }
                res.data[i]['start_timing'] = moment(res.data[i]['start_timing'], 'HH:mm:ss').format('HH:mm');
                res.data[i]['end_timing'] = moment(res.data[i]['end_timing'], 'HH:mm:ss').format('HH:mm');
            }
            this.setState({ history: res.data });
        });
    }

    render() {
        return <Table columns={this.columns} dataSource={this.state.history} scroll={{ x: 1500, y: 800 }} />;
    }
}

export default UserFutureBookings;
