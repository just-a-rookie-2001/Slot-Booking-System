import React from 'react';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
    CalendarOutlined,
    ClockCircleOutlined,
    HomeOutlined,
    LogoutOutlined,
    DatabaseOutlined,
} from '@ant-design/icons';

import UserContext from '../context/usercontext';

const { Header, Content, Footer, Sider } = Layout;

class AdminPage extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            rooms: [],
            width: 0,
            selectedMenuItem: [this.props.location.pathname],
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        // handle resize
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    toggle = () => {
        setTimeout(() => {
            this.setState({ collapsed: true });
        }, 500);
    };

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth });
    }

    render() {
        if (!this.context.isAuthenticated) {
            return <Redirect to="/login" />;
        } else if (!this.context.isAdmin) {
            return <Redirect to="/home" />;
        }
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    className="sidenav"
                    collapsed={this.state.collapsed}
                    onMouseEnter={() => this.setState({ collapsed: false })}
                    onMouseLeave={this.toggle}
                    collapsedWidth={window.innerWidth > 460 ? 80 : 0}
                >
                    <div className="logo">
                        {this.state.collapsed ? (
                            <img src="/logo.png" alt="logo" style={{ height: 32 }} />
                        ) : (
                            <img src="/logo-full.png" alt="logo" style={{ height: 32 }} />
                        )}
                    </div>
                    <Menu theme="dark" mode="inline" selectedKeys={this.state.selectedMenuItem}>
                        <Menu.Item key="/admin/dashboard" icon={<HomeOutlined />}>
                            <Link to="/admin/dashboard">Dashboard</Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/bookings" icon={<CalendarOutlined />}>
                            <Link to="/admin/bookings">Pending Requests</Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/rooms" icon={<DatabaseOutlined />}>
                            <Link to="/admin/rooms">Rooms</Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/history" icon={<ClockCircleOutlined />}>
                            <Link to="/admin/history">Records</Link>
                        </Menu.Item>
                        <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={this.context.logout}>
                            Logout
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ textAlign: 'center' }}></Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Admin</Breadcrumb.Item>
                            <Breadcrumb.Item>{this.context.email}</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            {this.props.children}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Created by{' '}
                        <a
                            href="https://www.linkedin.com/in/jaimik-patel-0690841b2/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Jaimik Patel
                        </a>{' '}
                        and{' '}
                        <a
                            href="https://www.linkedin.com/in/moksh-doshi-a4a0821b2/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Moksh Doshi
                        </a>{' '}
                        as a part of Website Making Challenge 2020, Programming Club
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default withRouter(AdminPage);
