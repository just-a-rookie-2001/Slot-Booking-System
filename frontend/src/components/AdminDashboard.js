import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Col, Row, Card } from 'antd';
import { Bar } from 'react-chartjs-2';

import { apiConfig } from "../config/config";
import UserContext from '../context/usercontext';


class AdminDashboard extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            bookings: null,
            rooms: null,
            datavalue: null,
            datavalue2: null,
            inidata: null,
        };
        this.chartRef = React.createRef();
    }

    cardData = null;
    graphData = null;
    graphData2 = null;
    g1Options = null;
    g2Options = null;

    componentDidMount() {
        this.fetchData();
    }
    fetchData = () => {
        const config = {
            headers: { Authorization: `Token ${this.context.token}` },
        };
        axios.get(`${apiConfig.baseUrl}admin/dashboard`, config).then((res) => this.filterData(res.data));
    };
    randomColor = () => {
        const r = Math.round(Math.random() * 255);
        const g = Math.round(Math.random() * 255);
        const b = Math.round(Math.random() * 255);
        return `rgb(${r}, ${g}, ${b})`;
    };

    filterData = (data) => {
        this.cardData = data[0];

        this.graphData = {
            labels: Object.keys(data[1]),
            datasets: [
                {
                    label: 'Number of Bookings',
                    data: Object.values(data[1]),
                    fill: true,
                    backgroundColor: this.randomColor(),
                    borderColor: this.randomColor(),
                },
            ],
        };
        this.g1Options = {
            maintainAspectRatio: false,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            min: 0,
                            stepSize: 1,
                            maximum: null,
                        },
                    },
                ],
            },
        };

        this.graphData2 = {
            labels: Object.keys(data[2]).map(
                (value, _index) =>
                    moment(value, 'HH:mm:ss').format('HH:mm') +
                    ' - ' +
                    moment(value, 'HH:mm:ss').add(1.5, 'hours').format('HH:mm')
            ),
            datasets: [
                {
                    label: 'Number of Bookings',
                    data: Object.values(data[2]),
                    fill: true,
                    backgroundColor: this.randomColor(),
                    borderColor: this.randomColor(),
                },
            ],
        };
        this.g2Options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            callback: function (value) {
                                if (value % 1 === 0) {
                                    return value;
                                }
                            },
                        },
                    },
                ],
            },
        };
        this.setState({
            card: this.cardData,
            graph1: this.graphData,
            graph2: this.graphData2,
        });
        return data;
    };

    render() {
        return (
            <>
                <Row gutter={[64, 32]} style={{ justifyContent: 'space-around' }}>
                    {this.state.graph1 && (
                        <>
                            <Col>
                                <Card
                                    className="responsiveCard"
                                    style={{
                                        backgroundColor: 'rgba(255,7,58,.12549)',
                                        color: '#ff073a',
                                    }}
                                    hoverable
                                >
                                    <h2 style={{ color: 'rgba(255,7,58,.6)' }}># of Users</h2>
                                    <strong style={{ fontSize: '2rem' }}>{this.state.card.users - 1}</strong>
                                </Card>
                            </Col>
                            <Col>
                                <Card
                                    className="responsiveCard"
                                    style={{
                                        backgroundColor: 'rgba(0,123,255,.0627451)',
                                        color: '#007bff',
                                    }}
                                    hoverable
                                >
                                    <h2 style={{ color: 'rgba(0,123,255,.6)' }}># of Bookings</h2>
                                    <strong style={{ fontSize: '2rem' }}>{this.state.card.bookings}</strong>
                                </Card>
                            </Col>
                            <Col>
                                <Card
                                    className="responsiveCard"
                                    style={{
                                        backgroundColor: 'rgba(255,193,7,.12549)',
                                        color: '#fd7e14',
                                    }}
                                    hoverable
                                >
                                    <h2 style={{ color: 'rgba(255,193,7,.8)' }}># of Rooms</h2>
                                    <strong style={{ fontSize: '2rem' }}>{this.state.card.rooms}</strong>
                                </Card>
                            </Col>
                        </>
                    )}
                </Row>
                <Row style={{ justifyContent: 'space-around' }} gutter={4}>
                    {this.state.graph1 && (
                        <>
                            <Col className="graph1">
                                <Card title="Bookings per Building" bordered={false}>
                                    <Bar data={this.state.graph1} height={500} options={this.g1Options} />
                                </Card>
                            </Col>
                            <Col className="graph2">
                                <Card title="Bookings per Slot" bordered={false}>
                                    <Bar data={this.state.graph2} height={500} options={this.g2Options} />
                                </Card>
                            </Col>
                        </>
                    )}
                </Row>
            </>
        );
    }
}

export default AdminDashboard;
