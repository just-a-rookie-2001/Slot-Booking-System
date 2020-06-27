import React from "react";
import axios from 'axios';
import moment from "moment";
import { Card, Avatar, Row, Col, DatePicker, Badge, Divider, Select } from 'antd';
import { Link } from "react-router-dom";

const { Meta } = Card;

class RoomList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filterData: [],
            roomData: [],
            start: null,
            end: null,
            date: moment().add(1, 'day').format("YYYY-MM-DD"),
        }
    }

    fetchData = () => {
        axios.get('http://127.0.0.1:8000/api/filter/roomlist/')
            .then(res => {
                res.data.sort((a, b) => {
                    a = a.school.toLowerCase();
                    b = b.school.toLowerCase();
                    return (a < b) ? -1 : (a > b) ? 1 : 0;;
                });
                this.setState({ roomData: res.data })
            })
    }

    onTimeChange = (values) => {
        console.log(values)
        const start = moment(values[0]).format("HH:mm")
        const end = moment(values[1]).format("HH:mm")
        this.setState({ start: start, end: end })
        axios.post("http://127.0.0.1:8000/api/filter/roomlist/", {
            "date": this.state.date,
            "start": start,
            "end": end
        }).then(res => this.setState({ filterData: res.data }, () => { console.log(this.state.filterData) }))
    }

    onSlotChange = (values) => {
        console.log(values)
        const start = values.split("-")[0]
        const end = values.split("-")[1]
        this.setState({ start: start, end: end })
        axios.post("http://127.0.0.1:8000/api/filter/roomlist/", {
            "date": this.state.date,
            "start": start,
            "end": end
        }).then(res => this.setState({ filterData: res.data }, () => { console.log(this.state.filterData) }))
    }

    renderRooms = () => {
        console.log("Both data", this.state.roomData, this.state.filterData)
        const roomData = this.state.roomData
        const filteredData = this.state.filterData
        return roomData.map((item, key) => {
            var result = "Available";
            var color = "#1890ff";
            var divider = null

            // School Divider
            if (key === 0) {
                divider = <Divider>{item.school}</Divider>
            } else if (roomData[key].school !== roomData[key - 1].school) {
                divider = <Divider>{item.school}</Divider>
            }


            // Pop-up status Badge 
            if (Array.isArray(filteredData) && filteredData.length) {
                var hasMatch = false;
                var i = 0
                for (var index = 0; index < filteredData.length; ++index) {
                    var obj = filteredData[index];
                    if (obj.id === item.id) {
                        hasMatch = true;
                        i = index
                        break;
                    }
                }
                if (hasMatch) {
                    if (filteredData[i].admin_did_accept) { result = "Booked"; color = "red" }
                    else if (filteredData[i].is_pending) { result = "Queue"; color = "gold" }

                    return (
                        <>
                            {divider}
                            <Col className="gutter-row" span={{ xs: 24, sm: 12, md: 8, lg: 6 }} key={key} >
                                <Link to={`/rooms/${item.id}`}>
                                    <Badge count={result} style={{ backgroundColor: color }}>
                                        <Card
                                            style={{ width: 300 }}
                                            cover={this.coverPhoto(item["school"])}
                                            hoverable
                                        >
                                            <Meta
                                                avatar={<Avatar src="logo.png" />}
                                                title={item.room_name}
                                                description={item.description}
                                            />
                                        </Card>
                                    </Badge>
                                </Link>
                            </Col>
                        </>
                    )
                } else if (this.state.start && this.state.end) {
                    console.log("inside has value else");
                    return (
                        <>
                            {divider}
                            <Col className="gutter-row" span={{ xs: 24, sm: 12, md: 8, lg: 6 }} key={key} >
                                <Link to={`/rooms/${item.id}`}>
                                    <Badge count={result} style={{ backgroundColor: color }}>
                                        <Card
                                            style={{ width: 300 }}
                                            cover={this.coverPhoto(item["school"])}
                                            hoverable
                                        >
                                            <Meta
                                                avatar={<Avatar src="logo.png" />}
                                                title={item.room_name}
                                                description={item.description}
                                            />
                                        </Card>
                                    </Badge>
                                </Link>
                            </Col>
                        </>);
                }
            } else if (this.state.start && this.state.end) {
                return (
                    <>
                        {divider}
                        < Col className="gutter-row" span={{ xs: 24, sm: 12, md: 8, lg: 6 }} key={key} >
                            <Link to={`/rooms/${item.id}`}>
                                <Badge count={result} style={{ backgroundColor: color }}>
                                    <Card
                                        style={{ width: 300 }}
                                        cover={this.coverPhoto(item["school"])}
                                        hoverable
                                    >
                                        <Meta
                                            avatar={<Avatar src="logo.png" />}
                                            title={item.room_name}
                                            description={item.description}
                                        />
                                    </Card>
                                </Badge>
                            </Link>
                        </Col>
                    </>);
            }
            return (
                <>
                    {divider}
                    <Col className="gutter-row" span={{ xs: 24, sm: 12, md: 8, lg: 6 }} key={key} >
                        <Link to={`/rooms/${item.id}`}>
                            <Card
                                style={{ width: 300 }}
                                cover={this.coverPhoto(item["school"])}
                                hoverable
                            >
                                <Meta
                                    avatar={<Avatar src="logo.png" />}
                                    title={item.room_number + " - " + item.room_name}
                                    description={item.description}
                                />
                            </Card>
                        </Link>
                    </Col>
                </>
            );

        })
    }

    componentDidMount() {
        this.fetchData();
    }

    coverPhoto = (item) => {
        if (item === "SEAS") {
            return <img alt="example" src="seas.jpg" />
        } else if (item === "AMSOM") {
            return <img alt="example" src="amsom.jpg" />
        } else if (item === "SAS") {
            return <img alt="example" src="sas.jpg" />
        } else if (item === "BLS") {
            return <img alt="example" src="bls.jpg" />
        } else if (item === "SCS") {
            return <img alt="example" src="scs.jpg" />
        } else {
            return <img alt="example" src="logo.png" />
        }
    }

    render() {
        return (
            <div>
                <Row gutter={[16, { xs: 32, sm: 24, md: 16, lg: 8 }]} style={{ justifyContent: 'center' }}>
                    <Col className="gutter-row" span={{ xs: 24, sm: 12, md: 8, lg: 6 }}>
                        <DatePicker
                            defaultValue={moment().add(1, 'day')}
                            onChange={(_date, dateString) => this.setState({ date: dateString })}
                            format={"YYYY-MM-DD"}
                            size="large"
                            showToday={false}
                            disabledDate={current => { return current < moment() }}
                        // style={{ marginRight: "10px" }}
                        />
                    </Col>
                    <Col className="gutter-row" span={{ xs: 24, sm: 12, md: 8, lg: 6 }}>
                        {/* <TimePicker.RangePicker
                            format={'HH:mm'}
                            minuteStep={30}
                            size="large"
                            onChange={(values) => {
                                if (values !== null) {
                                    this.onTimeChange(values);
                                } else { this.setState({ filterData: null, start: null, end: null }); }
                            }}
                            showTime={{ hideDisabledOptions: true }}
                            disabledHours={() => { return [0, 1, 2, 3, 4, 5, 6, 7, 21, 22, 23, 24] }}
                        /> */}
                        <Select style={{ width: 180 }}
                            size="large"
                            onChange={(values) => {
                                if (values !== null) {
                                    this.onSlotChange(values);
                                } else { this.setState({ filterData: null, start: null, end: null }); }
                            }}>
                            <Select.Option value="8:00-9:30">8:00 -> 9:30</Select.Option>
                            <Select.Option value="9:30-11:00">9:30 -> 11:00</Select.Option>
                            <Select.Option value="11:00-12:30">11:00 -> 12:30</Select.Option>
                            <Select.Option value="12:30-14:00">12:30 -> 14:00</Select.Option>
                            <Select.Option value="14:00-15:30">14:00 -> 15:30</Select.Option>
                            <Select.Option value="15:30-17:00">15:30 -> 17:00</Select.Option>
                            <Select.Option value="17:00-18:30">17:00 -> 18:30</Select.Option>
                            <Select.Option value="18:30-20:00">18:30 -> 20:00</Select.Option>
                        </Select>
                    </Col>
                </Row>
                <Row gutter={[16, { xs: 32, sm: 24, md: 16, lg: 8 }]} style={{ justifyContent: 'space-around', marginTop: 20 }}>
                    {this.renderRooms()}
                </Row>
            </div>
        )
    }
}

export default RoomList