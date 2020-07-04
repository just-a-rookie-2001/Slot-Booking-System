import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

import UserContext from '../context/usercontext';


class LoginForm extends React.Component {
    static contextType = UserContext;

    onFinish = (values) => {
        this.context.login(values.email, values.password, values.remember);
    };

    render() {
        return (
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
            >
                <Form.Item
                    name="email"
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
                    <Input
                        prefix={<MailOutlined className="site-form-item-icon" />}
                        placeholder="E-Mail"
                        type="email"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <Link className="login-form-forgot" to="/forgotpassword">
                        Forgot password
                    </Link>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    <Button type="secondary" className="login-form-button" style={{ marginLeft: '10px' }}>
                        <Link to="/register">Register</Link>
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default LoginForm;
