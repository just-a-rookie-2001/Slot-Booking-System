import React from 'react';
import axios from 'axios';
import {
    Card,
    Avatar,
    Row,
    Col,
    Form,
    Input,
    Button,
    Select,
    InputNumber,
    PageHeader,
    Divider,
    Popconfirm,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { apiConfig } from '../config/config';
import UserContext from '../context/usercontext';

const { Meta } = Card;

class AdminRoom extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = { rooms: [], formVisible: false };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        const config = {
            headers: { Authorization: `Token ${this.context.token}` },
        };
        axios.get(`${apiConfig.baseUrl}admin/rooms`, config).then((res) => {
            res.data.sort((a, b) => {
                a = a.school.toLowerCase();
                b = b.school.toLowerCase();
                return a < b ? -1 : a > b ? 1 : 0;
            });
            this.setState({ rooms: res.data });
        });
    };

    onFinish = (values) => {
        const config = {
            headers: { Authorization: `Token ${this.context.token}` },
        };
        axios
            .post(
                `${apiConfig.baseUrl}admin/rooms`,
                {
                    room_number: values['Room Number'],
                    room_name: values['Room Name'],
                    description: values['Room Description'],
                    school: values['School'],
                },
                config
            )
            .then((_res) => this.fetchData());
        this.setState({ formVisible: false });
    };

    coverPhoto = (item) => {
        if (item === 'SEAS') {
            return <img alt="example" src="/images/seas.jpg" />;
        } else if (item === 'AMSOM') {
            return <img alt="example" src="/images/amsom.jpg" />;
        } else if (item === 'SAS') {
            return <img alt="example" src="/images/sas.jpg" />;
        } else if (item === 'BLS') {
            return <img alt="example" src="/images/bls.jpg" />;
        } else if (item === 'SCS') {
            return <img alt="example" src="/images/scs.jpg" />;
        } else {
            return <img alt="example" src="/logo.png" />;
        }
    };

    handleDelete = (data) => {
        const config = {
            headers: { Authorization: `Token ${this.context.token}` },
        };
        axios.delete(`${apiConfig.baseUrl}admin/rooms/${data.id}`, config).then((_res) => this.fetchData());
    };

    renderRooms = () => {
        const { rooms } = this.state;
        return rooms.map((item, key) => {
            var divider = null;
            if (key === 0) {
                divider = <Divider>{item.school}</Divider>;
            } else if (rooms[key].school !== rooms[key - 1].school) {
                divider = <Divider>{item.school}</Divider>;
            }
            return (
                <React.Fragment key={key}>
                    {divider}
                    <Col className="gutter-row" xs={24} sm={12} md={8} lg={6}>
                        <Card
                            cover={this.coverPhoto(item.school)}
                            actions={[
                                <Popconfirm
                                    placement="bottom"
                                    title="Are you sure to delete this room?"
                                    onConfirm={() => this.handleDelete(item)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <DeleteOutlined key="delete" />
                                </Popconfirm>,
                            ]}
                            hoverable
                        >
                            <Meta
                                avatar={<Avatar src="/logo.png" />}
                                title={item.room_number + ' - ' + item.room_name}
                                description={item.description}
                            />
                        </Card>
                    </Col>
                </React.Fragment>
            );
        });
    };

    render() {
        if (this.state.formVisible) {
            return (
                <div>
                    <PageHeader
                        className="site-page-header"
                        onBack={() => this.setState({ formVisible: false })}
                        title="Create a Room"
                        subTitle="Please fill out this form"
                    />
                    ,
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        layout="horizontal"
                        size="large"
                        onFinish={this.onFinish}
                    >
                        <Form.Item label="Room Number" name="Room Number" rules={[{ required: true }]}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item label="Room Name" name="Room Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Room Description" name="Room Description" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="School" name="School" rules={[{ required: true }]}>
                            <Select placeholder="Select room location">
                                <Select.Option value="SEAS">School of Engineering and Applied Sciences</Select.Option>
                                <Select.Option value="SAS">School of Arts and Sciences</Select.Option>
                                <Select.Option value="AMSOM">Amrut Mody School of Management</Select.Option>
                                <Select.Option value="BLS">Biological Life Sciences</Select.Option>
                                <Select.Option value="SCS">School of Computer Studies</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            );
        }
        return (
            <Row gutter={[16, { xs: 32, sm: 24, md: 16, lg: 12 }]} style={{ justifyContent: 'space-around' }}>
                {this.renderRooms()}
                <>
                    <Divider>Create New Room</Divider>
                    <Col className="gutter-row" xs={24} sm={12} md={8} lg={6}>
                        <Card
                            cover={<img alt="example" src="/images/meetingroom.jpg" />}
                            hoverable
                            onClick={(e) => this.setState({ formVisible: true })}
                        >
                            <Meta
                                avatar={<Avatar src="/logo.png" />}
                                title="Create new Room"
                                description="Click here to crete a new room"
                            />
                        </Card>
                    </Col>
                </>
            </Row>
        );
    }
}

export default AdminRoom;
