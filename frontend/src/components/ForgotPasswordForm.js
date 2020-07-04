import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Result, Alert, Spin } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

import { apiConfig } from "../config/config";


class ForgotPasswordForm extends React.Component {
    state = {
        email: null,
        emailSent: false,
        verifyToken: false,
        passwordSubmit: false,
        error: false,
        loading: false,
    };
    errorMsg = null;
    onEmailSubmit = (values) => {
        this.setState({ loading: true });
        axios
            .post(`${apiConfig.baseUrl}user/forgotpassword`, {
                email: values.email,
            })
            .then((_res) => {
                this.setState({
                    loading: false,
                    error: false,
                    emailSent: true,
                    email: values.email,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ loading: false, error: true });
            });
    };
    onTokenSubmit = (values) => {
        this.setState({ loading: true });
        axios
            .post(`${apiConfig.baseUrl}user/verifytoken`, {
                token: values.token,
                email: this.state.email,
            })
            .then((_res) => {
                this.setState({
                    loading: false,
                    error: false,
                    verifyToken: true,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ loading: false, error: true });
            });
    };
    onPasswordSubmit = (values) => {
        this.setState({ loading: true });
        axios
            .post(`${apiConfig.baseUrl}user/changepassword`, {
                email: this.state.email,
                password: values.password,
            })
            .then((_res) => {
                this.setState({
                    loading: false,
                    error: false,
                    passwordSubmit: true,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ loading: false, error: true });
            });
    };

    render() {
        if (this.state.loading) {
            return <Spin size="large" />;
        }
        if (this.state.error) {
            this.errorMsg = (
                <Alert
                    message="Error"
                    description="Some error occured"
                    type="error"
                    showIcon
                    style={{ marginBottom: 20 }}
                />
            );
        } else {
            this.errorMsg = null;
        }
        if (this.state.passwordSubmit) {
            return (
                <Result
                    status="success"
                    title="Successfully Changed Password!"
                    extra={[
                        <Button type="primary" key="console">
                            <Link to="/login">Login</Link>
                        </Button>,
                    ]}
                />
            );
        }
        if (this.state.verifyToken) {
            return (
                <div>
                    {this.errorMsg}
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={this.onPasswordSubmit}
                    >
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your new password',
                                },
                            ]}
                        >
                            <Input.Password placeholder="New Password" />
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
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            );
        }
        if (this.state.emailSent) {
            return (
                <div>
                    {this.errorMsg}
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={this.onTokenSubmit}
                    >
                        <Form.Item
                            name="token"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the token sent to your email',
                                },
                            ]}
                        >
                            <Input prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Token" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            );
        }
        return (
            <div>
                {this.errorMsg}
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={this.onEmailSubmit}
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
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default ForgotPasswordForm;
