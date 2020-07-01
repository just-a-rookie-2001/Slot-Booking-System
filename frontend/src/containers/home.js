import React from 'react';
import { Redirect, Link, withRouter } from 'react-router-dom';
import UserContext from '../context/usercontext';

import { Layout, Menu, Breadcrumb } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, HomeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

class HomePage extends React.Component {
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
		} else if (this.context.isAdmin) {
			return <Redirect to="/admin/dashboard" />;
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
						<Menu.Item key="/home" icon={<HomeOutlined />}>
							<Link to="/home">Home</Link>
						</Menu.Item>
						<Menu.Item key="/futurebookings" icon={<CalendarOutlined />}>
							<Link to="/futurebookings">Upcoming Events</Link>
						</Menu.Item>
						<Menu.Item key="/pastbookings" icon={<ClockCircleOutlined />}>
							<Link to="/pastbookings">Past Bookings</Link>
						</Menu.Item>
						<Menu.Item key="/account" icon={<UserOutlined />}>
							<Link to="/account">Your Account</Link>
						</Menu.Item>
						<Menu.Item key="5" icon={<LogoutOutlined />} onClick={this.context.logout}>
							Logout
						</Menu.Item>
					</Menu>
				</Sider>
				<Layout className="site-layout">
					<Header className="site-layout-background" style={{ textAlign: 'center' }}>
						{/* <Typography.Title>Ahmedabad University Room Booking</Typography.Title> */}
					</Header>
					<Content style={{ margin: '0 16px' }}>
						<Breadcrumb style={{ margin: '16px 0' }}>
							<Breadcrumb.Item>User</Breadcrumb.Item>
							<Breadcrumb.Item>{this.context.email}</Breadcrumb.Item>
						</Breadcrumb>
						<div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
							{this.props.children}
						</div>
					</Content>
					<Footer style={{ textAlign: 'center' }}>Created by Jaimik Patel and Moksh Doshi</Footer>
				</Layout>
			</Layout>
		);
	}
}

export default withRouter(HomePage);
