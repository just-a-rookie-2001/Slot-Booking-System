import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { Table, Tooltip, Calendar, Row, Col, Modal, Radio } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone, LoadingOutlined } from '@ant-design/icons';

import { apiConfig } from "../config/config";
import UserContext from '../context/usercontext';

class BookingHistory extends React.Component {
    static contextType = UserContext;
    state = {
        display: 'table',
        modalVisible: false,
        history: null,
        value: moment(),
        selectedValue: moment(),
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
            title: 'Requested By',
            dataIndex: 'user',
            sorter: (a, b) => a['user'].length - b['user'].length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Room #',
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
            title: 'Pending',
            dataIndex: 'is_pending',
        },
        {
            title: 'Admin Action',
            dataIndex: 'admin_did_accept',
            fixed: 'right',
            width: 75,
        },
    ];

    onSelect = (value) => {
        this.setState({
            value: value,
            selectedValue: value,
            modalVisible: true,
        });
    };

    onPanelChange = (value) => {
        this.setState({ value });
    };

    componentDidMount() {
        const config = {
            headers: { Authorization: `Token ${this.context.token}` },
        };
        axios.get(`${apiConfig.baseUrl}admin/bookings`, config).then((res) => {
            for (var i in res.data) {
                if (res.data[i]['admin_did_accept']) {
                    res.data[i]['admin_did_accept'] = (
                        <Tooltip title="Request Accepted" color="green">
                            <CheckCircleTwoTone twoToneColor="green" />
                        </Tooltip>
                    );
                    res.data[i]['is_pending'] = (
                        <Tooltip title="Request not Pending" color="#1890ff">
                            <CloseCircleTwoTone />
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
                        <Tooltip title="Request not Pending" color="#1890ff">
                            <CloseCircleTwoTone />
                        </Tooltip>
                    );
                }
                res.data[i]['start_timing'] = moment(res.data[i]['start_timing'], 'HH:mm:ss').format('HH:mm');
                res.data[i]['end_timing'] = moment(res.data[i]['end_timing'], 'HH:mm:ss').format('HH:mm');
            }
            this.setState({ history: res.data }, () => {
                console.log(this.state.history);
            });
        });
    }

    renderData = () => {
        if (this.state.display === 'calendar') {
            var result = null;
            if (this.state.modalVisible) {
                result = this.state.history.filter(
                    (value) => value['booking_date'] === this.state.selectedValue.format('YYYY-MM-DD')
                );
                result = result.length > 0 ? result : null;
            }
            return (
                <>
                    <Calendar value={this.state.value} onSelect={this.onSelect} onPanelChange={this.onPanelChange} />
                    <Modal
                        centered
                        title={`Bookings on ${this.state.selectedValue.format('YYYY-MM-DD')}`}
                        visible={this.state.modalVisible}
                        width={768}
                        onOk={() => this.setState({ modalVisible: false })}
                        onCancel={() => this.setState({ modalVisible: false })}
                    >
                        <Table dataSource={result} columns={result && this.columns} scroll={{ x: 1500, y: 400 }} />
                    </Modal>
                </>
            );
        }
        return <Table columns={this.columns} dataSource={this.state.history} scroll={{ x: 1500, y: 512 }} />;
    };

    render() {
        return (
            <>
                <Row style={{ justifyContent: 'center' }} gutter={[0, 8]}>
                    <Col>
                        <Radio.Group
                            defaultValue="table"
                            size="large"
                            buttonStyle="solid"
                            onChange={(e) => this.setState({ display: e.target.value })}
                        >
                            <Radio.Button value="table">Table</Radio.Button>
                            <Radio.Button value="calendar">Calendar</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
                <Row>{this.renderData()}</Row>
            </>
        );
    }
}

export default BookingHistory;
