import React from 'react';
import axios from "axios";
import { Card, Button, Row, Col, Empty, Modal, Input } from "antd";
import { fromDecimal } from "../utility"

class AdminBooking extends React.Component {
    constructor(props) {
        super(props);
        this.state = { response: [], modalVisible: false, feedback: null, accept: null, id: null, }
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        axios.get("http://127.0.0.1:8000/api/filter/adminfilter/pending")
            .then(res => {
                this.setState({ response: res.data }, () => { console.log(this.state.response) })
            })
    }

    handleButtonClick(event) {
        event.preventDefault();
        let message = this.state.feedback;
        if (message === "" || message === null || message === false) {
            message = "Admin has not given any feedback"
        }
        axios.post(`http://127.0.0.1:8000/api/filter/adminfilter/pending`, {
            "id": this.state.id,
            "admin_did_accept": this.state.accept,
            "admin_feedback": message
        }).then(_res => { this.fetchData(); this.setState({modalVisible: false}) })
    }

    render() {
        if (this.state.response.length === 0) {
            return <Empty description={<span>All Bookings have been attended</span>} />
        }
        return (
            <Row gutter={[16, { xs: 32, sm: 24, md: 16, lg: 8 }]} style={{ justifyContent: 'space-around' }}>
                {this.state.response !== null && this.state.response.map((value, index) =>
                    <Col className="gutter-row" span={{ xs: 24, sm: 12, md: 8, lg: 6 }} key={index}>
                        <Card size="large" title={"Request " + (index + 1)} style={{ width: 300 }} hoverable>
                            <p>Requested By: {value["user"]}</p>
                            <p>Room: {value["room_number"] + " - " + value["room_name"]}</p>
                            <p>Date: {value["booking_date"]}</p>
                            <p>From: {fromDecimal(value["start_timing"])}</p>
                            <p>To: {fromDecimal(value["end_timing"], 1)}</p>
                            <p>Reason: {value["purpose_of_booking"]}</p>
                            <p><>
                                <Button type="primary" size="large" style={{ marginRight: 10 }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({
                                            modalVisible: true,
                                            id: value["id"],
                                            accept: true
                                        })
                                    }}>Accept</Button>
                                <Button type="primary" size="large" danger
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({
                                            modalVisible: true,
                                            id: value["id"],
                                            accept: false
                                        })
                                    }}>Decline</Button>
                            </>
                            </p>
                        </Card>
                    </Col>
                )}
                <Modal
                    title="Please enter the feedback for selected response"
                    centered
                    visible={this.state.modalVisible}
                    onOk={(e) => { this.handleButtonClick(e) }}
                    onCancel={() => { this.setState({ modalVisible: false }) }}
                >
                    <Input.TextArea
                        placeholder="Enter your reason for taking this action"
                        autoSize={{ minRows: 4, maxRows: 8 }}
                        onChange={(v) => { this.setState({ feedback: v.target.value }) }}
                    />
                </Modal>
            </Row>
        );
    }
}

export default AdminBooking