import React from "react";
import axios from 'axios';
import { Card, Avatar, Row, Col, Form, Input, Button, Select, InputNumber, PageHeader, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import UserContext from "../context/usercontext";

const { Meta } = Card;

class AdminRoom extends React.Component {
    static contextType = UserContext

    constructor(props) {
        super(props)
        this.state = { rooms: [], formVisible: false }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        const config = { headers: { "Authorization": `Token ${this.context.token}` } }
        axios.get('http://localhost:8000/api/rooms/', config).then(res => { this.setState({ rooms: res.data }) })
    }

    onFinish = (values) => {
        const config = { headers: { "Authorization": `Token ${this.context.token}` } }
        axios.post("http://localhost:8000/api/rooms/", {
            "room_number": values["Room Number"],
            "room_name": values["Room Name"],
            "description": values["Room Description"],
            "school": values["School"],
        }, config).then(_res => this.fetchData())
        this.setState({ formVisible: false })
    }

    coverPhoto = (item) => {
        if (item === "SEAS") {
            return <img alt="example" src="/seas.jpg" />
        } else if (item === "AMSOM") {
            return <img alt="example" src="/amsom.jpg" />
        } else if (item === "SAS") {
            return <img alt="example" src="/sas.jpg" />
        } else if (item === "BLS") {
            return <img alt="example" src="/bls.jpg" />
        } else if (item === "SCS") {
            return <img alt="example" src="/scs.jpg" />
        } else {
            return <img alt="example" src="/logo.png" />
        }
    }

    handleDelete = (data) => {
        axios.delete(`http://localhost:8000/api/rooms/${data.id}/`).then(_res => this.fetchData());
    }

    render() {
        if (this.state.formVisible) {
            return <div>
                <PageHeader
                    className="site-page-header"
                    onBack={() => this.setState({ formVisible: false })}
                    title="Create a Room"
                    subTitle="Please fill out this form"
                />,
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
        }
        return (
            <Row gutter={[16, { xs: 32, sm: 24, md: 16, lg: 8 }]} style={{ justifyContent: 'space-around' }}>
                {this.state.rooms.map((item, key) =>
                    <Col className="gutter-row" span={{ xs: 24, sm: 12, md: 8, lg: 6 }} key={key}>
                        {console.log(item.school)}
                        <Card
                            style={{ width: 300 }}
                            cover={this.coverPhoto(item.school)}
                            actions={[
                                <Popconfirm placement="bottom" title='Are you sure to delete this room?' onConfirm={() => this.handleDelete(item)} okText="Yes" cancelText="No">
                                    <DeleteOutlined key="delete" />
                                </Popconfirm>
                            ]}
                            hoverable
                        >
                            <Meta
                                avatar={<Avatar src="/logo.png" />}
                                title={item.room_number + " - " + item.room_name}
                                description={item.description}
                            />
                        </Card>
                    </Col>
                )}
                {<Col className="gutter-row" span={{ xs: 24, sm: 12, md: 8, lg: 6 }}>
                    <Card
                        style={{ width: 300 }}
                        cover={<img alt="example" src="/logo.png" style={{ width: 275, height: 250 }} />}
                        hoverable
                        onClick={(e) => this.setState({ formVisible: true })}
                    >
                        <Meta
                            avatar={<Avatar src="/logo.png" />}
                            title="Create new Room"
                            description="Click here to crete a new room"
                        />
                    </Card>
                </Col>}
            </Row>
        );
    }
}

export default AdminRoom