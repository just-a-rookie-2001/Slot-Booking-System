import React from 'react';
import axios from 'axios';
import { Avatar, Row, Descriptions } from 'antd';

import { apiConfig } from "../config/config";
import UserContext from '../context/usercontext';


class UserAccount extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = { user: [] };
    }
    componentDidMount() {
        const config = {
            headers: { Authorization: `Token  ${this.context.token}` },
        };
        axios.get(`${apiConfig.baseUrl}user/accountinfo`, config).then((res) => {
            this.setState({ user: res.data }, () => console.log(this.state.user));
        });
    }

    render() {
        var uType = 'Unknown';
        const type = this.state.user.type;
        var avatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

        if (type === 'F') {
            uType = 'Faculty';
            avatar = '/images/faculty.svg';
        } else if (type === 'C') {
            uType = 'Club';
            avatar = '/images/club.svg';
        }

        return (
            <>
                <Row gutter={[16, { xs: 32, sm: 24, md: 16, lg: 8 }]} style={{ justifyContent: 'center' }}>
                    <Descriptions bordered>
                        <Descriptions.Item>
                            <Avatar size={256} src={avatar} />
                        </Descriptions.Item>
                    </Descriptions>
                </Row>
                <Row gutter={[16, { xs: 32, sm: 24, md: 16, lg: 8 }]} style={{ justifyContent: 'space-around' }}>
                    <Descriptions bordered style={{ width: 1500 }}>
                        <Descriptions.Item label="E-Mail" span={3}>
                            {this.state.user.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Name" span={1}>
                            {this.state.user.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Account Type" span={2}>
                            {uType}
                        </Descriptions.Item>
                        <Descriptions.Item label="# of Total Requests" span={3}>
                            {this.state.user.total}
                        </Descriptions.Item>
                        <Descriptions.Item label="# of Accepted Requests" span={3}>
                            {this.state.user.accepted}
                        </Descriptions.Item>
                        <Descriptions.Item label="# of Pending Requests" span={3}>
                            {this.state.user.pending}
                        </Descriptions.Item>
                        <Descriptions.Item label="# of Declined Requests" span={3}>
                            {this.state.user.declined}
                        </Descriptions.Item>
                    </Descriptions>
                </Row>
            </>
        );
    }
}

export default UserAccount;
