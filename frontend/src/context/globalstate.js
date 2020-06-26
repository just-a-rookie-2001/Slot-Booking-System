import React from 'react';
import axios from 'axios';
import UserContext from './usercontext'

class GlobalState extends React.Component {

    state = {
        token: localStorage.getItem('token') || null,
        error: null,
        loading: false,
        email: localStorage.getItem('email') || null,
        isAuthenticated: Boolean(localStorage.getItem('token')) || false,
        isAdmin: Boolean(localStorage.getItem('admin')),
        login: this.login.bind(this),
        logout: this.logout.bind(this),
        register: this.register.bind(this),
    }

    register(email, name, password, workplace, ac_type) {
        axios.post("http://localhost:8000/api/user/register", {
            "email": email,
            "name": name,
            "password": password,
            "workplace": workplace,
            "user_type": ac_type
        }).then(_res => {
            this.setState({ error: null }, () => this.login(email, password))
        }).catch(err => {
            this.setState({ error: "Some error occured" })
        })

    }

    login(username, password, _rememberMe = false) {
        axios.post('http://localhost:8000/api-token-auth/', {
            username: username,
            password: password
        })
            .then(response => {
                if (response.status === 200) {
                    const token = response.data.token;
                    const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
                    localStorage.setItem("email", username);
                    localStorage.setItem('token', token);
                    localStorage.setItem('expirationDate', expirationDate);
                    axios.get(`http://localhost:8000/api/filter/adminfilter/checkadmin/${username}`).then(res => {
                        if (res.data["admin"]) {
                            localStorage.setItem('admin', res.data["admin"])
                        }
                        this.setState({
                            token: token,
                            isAuthenticated: true,
                            error: null,
                            email: username,
                            isAdmin: res.data["admin"],
                        })
                    })

                } else {
                    this.setState({ error: "Something went wrong" });
                }
            })
            .catch(_err => {
                this.setState({ error: "Please check your email or password" });
            })
    }

    logout() {
        localStorage.clear();
        this.setState({ isAuthenticated: false, token: null, isAdmin: false }, () => {
            console.log("logging out");
        });
    }

    render() {
        return (
            <UserContext.Provider value={this.state}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export default GlobalState;