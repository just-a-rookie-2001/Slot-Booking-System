import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { Link } from 'react-router-dom';

import UserContext from '../context/usercontext';


const { Option } = Select;
const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 4,
        span: 20,
    },
};

class RegisterForm extends React.Component {
    static contextType = UserContext;

    onFinish = (values) => {
        this.context.register(values.email, values.name, values.password, values.workplace, values.user_type);
    };

    render() {
        return (
            <Form {...layout} onFinish={this.onFinish}>
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter your name' }]}>
                    <Input placeholder="Name" type="text" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="E-Mail"
                    rules={[
                        {
                            type: 'pattern',
                            pattern: new RegExp('[a-z0-9._%+-]+@ahduni.edu.in'),
                            message: 'Please enter an Ahmedabad University Mail',
                        },
                        {
                            required: true,
                            message: 'Please input your Email',
                        },
                    ]}
                >
                    <Input placeholder="E-Mail" type="email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Confirm Password" />
                </Form.Item>
                <Form.Item name="workplace" label="Workplace" rules={[{ required: true }]}>
                    <Select placeholder="Select your Workplace">
                        <Option value=" "></Option>
                        <Option value="SEAS">School of Engineering and Applied Sciences</Option>
                        <Option value="SAS">School of Arts and Sciences</Option>
                        <Option value="AMSOM">Amrut Mody School of Management</Option>
                        <Option value="BLS">Biological Life Sciences</Option>
                        <Option value="SCS">School of Computer Studies</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="user_type" label="Account Type" rules={[{ required: true }]}>
                    <Select placeholder="Select your Account Type">
                        <Option value="F">Faculty</Option>
                        <Option value="C">Club</Option>
                    </Select>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                    <Button type="secondary" className="login-form-button" style={{ marginLeft: '10px' }}>
                        <Link to="/login">Login</Link>
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default RegisterForm;
