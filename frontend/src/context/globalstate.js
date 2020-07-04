import React from 'react';
import axios from 'axios';
import UserContext from './usercontext';

class GlobalState extends React.Component {
    state = {
        token: localStorage.getItem('token'),
        error: null,
        loading: false,
        email: localStorage.getItem('email'),
        isAuthenticated: Boolean(localStorage.getItem('token')),
        isAdmin: localStorage.getItem('admin') === 'true',
        login: this.login.bind(this),
        logout: this.logout.bind(this),
        register: this.register.bind(this),
    };

    register(email, name, password, workplace, ac_type) {
        axios
            .post('http://localhost:8000/api/user/register', {
                email: email,
                name: name,
                password: password,
                workplace: workplace,
                user_type: ac_type,
            })
            .then((_res) => {
                this.setState({ error: null }, () => this.login(email, password, true));
            })
            .catch((err) => {
                this.setState({ error: 'Some error occured' });
            });
    }

    login(username, password, rememberMe = false) {
        axios
            .post('http://localhost:8000/api/user/login', {
                username: username,
                password: password,
            })
            .then((response) => {
                if (response.status === 200) {
                    const admin = response.data.admin;
                    const token = response.data.token;
                    const expirationDate = new Date(new Date().getTime() + (rememberMe ? 24 : 1) * 60 * 60 * 1000);
                    localStorage.setItem('email', username);
                    localStorage.setItem('token', token);
                    localStorage.setItem('expirationDate', expirationDate);
                    localStorage.setItem('admin', admin);
                    this.setState({
                        token: token,
                        isAuthenticated: true,
                        error: null,
                        email: username,
                        isAdmin: admin,
                    });
                    setTimeout(() => {
                        this.logout();
                    }, (rememberMe ? 24 : 1) * 60 * 60 * 1000);
                } else {
                    this.setState({ error: 'Something went wrong' });
                }
            })
            .catch((_err) => {
                this.setState({ error: 'Please check your email or password' });
            });
    }

    logout() {
        localStorage.clear();
        this.setState({ isAuthenticated: false, token: null, isAdmin: false });
    }

    componentDidMount() {
        console.log('inside global context didMount');
        const token = localStorage.getItem('token');
        const expirationDate = new Date(localStorage.getItem('expirationDate'));
        if (token === undefined || expirationDate === undefined) {
            this.logout();
        } else {
            if (expirationDate <= new Date()) {
                this.logout();
            } else {
                setTimeout(() => this.logout(), expirationDate.getTime() - new Date().getTime());
            }
        }
    }

    render() {
        return <UserContext.Provider value={this.state}>{this.props.children}</UserContext.Provider>;
    }
}

export default GlobalState;
