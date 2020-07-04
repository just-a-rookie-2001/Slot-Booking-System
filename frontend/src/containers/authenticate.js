import React from 'react';
import { Redirect } from 'react-router-dom';
import { Layout, Alert } from 'antd';

import UserContext from '../context/usercontext';


const { Header, Content, Footer } = Layout;

class AuthLayout extends React.Component {
    static contextType = UserContext;
    errorMsg = null;

    render() {
        if (this.context.error) {
            this.errorMsg = <Alert message="Error" description={this.context.error} type="error" showIcon />;
        } else if (this.context.isAuthenticated) {
            if (this.context.isAdmin) {
                this.errorMsg = <Redirect to="/admin/dashboard" />;
            } else {
                this.errorMsg = <Redirect to="/home" />;
            }
        }
        return (
            <div>
                {this.errorMsg}
                <Layout className="layout">
                    <Header>
                        <div>
                            <img src="/logo-full.png" alt="logo" style={{ height: '40px' }} />
                        </div>
                    </Header>
                    <Content
                        style={{
                            padding: '50px 50px 0 50px',
                            maxWidth: '758px',
                            left: '50%',
                            transform: 'translate(-50%,0)',
                            position: 'relative',
                        }}
                    >
                        <div className="site-layout-content">{this.props.children}</div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Created by Jaimik Patel and Moksh Doshi as a part of Website Making Challenge 2020, Programming
                        Club
                    </Footer>
                </Layout>
            </div>
        );
    }
}

export default AuthLayout;
