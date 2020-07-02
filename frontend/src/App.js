import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import UserContext from './context/usercontext';

import GlobalState from './context/globalstate';
import HomePage from './containers/home';
import AuthLayout from './containers/authenticate';
import AdminLayout from './containers/admin';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import RoomList from './components/RoomListView';
import RoomDetail from './components/RoomDetailView';
import PastBookings from './components/PastBookingListView';
import FutureBookings from './components/FutureBookingListView';
import UserAccount from './components/UserAccountView';

import Dashboard from './components/AdminDashboard';
import Bookings from './components/AdminBookings';
import Rooms from './components/AdminRoom';
import History from './components/AdminHistory';

class App extends React.Component {
    static contextType = UserContext;

    render() {
        return (
            <GlobalState>
                <BrowserRouter>
                    <Route exact path="/">
                        <Redirect to="/login" />
                    </Route>
                    <Route exact path="/register">
                        <AuthLayout>
                            <RegisterForm />
                        </AuthLayout>
                    </Route>
                    <Route exact path="/login">
                        <AuthLayout>
                            <LoginForm />
                        </AuthLayout>
                    </Route>
                    <Route exact path="/forgotpassword">
                        <AuthLayout>
                            <ForgotPasswordForm />
                        </AuthLayout>
                    </Route>
                    <Route exact path="/home">
                        <HomePage>
                            <RoomList />
                        </HomePage>
                    </Route>
                    <Route exact path="/rooms/:roomID">
                        <HomePage>
                            <RoomDetail />
                        </HomePage>
                    </Route>
                    <Route exact path="/pastbookings">
                        <HomePage>
                            <PastBookings />
                        </HomePage>
                    </Route>
                    <Route exact path="/futurebookings">
                        <HomePage>
                            <FutureBookings />
                        </HomePage>
                    </Route>
                    <Route exact path="/account">
                        <HomePage>
                            <UserAccount />
                        </HomePage>
                    </Route>
                    <Route exact path="/admin/dashboard">
                        <AdminLayout>
                            <Dashboard />
                        </AdminLayout>
                    </Route>
                    <Route exact path="/admin/bookings">
                        <AdminLayout>
                            <Bookings />
                        </AdminLayout>
                    </Route>
                    <Route exact path="/admin/rooms">
                        <AdminLayout>
                            <Rooms />
                        </AdminLayout>
                    </Route>
                    <Route exact path="/admin/history">
                        <AdminLayout>
                            <History />
                        </AdminLayout>
                    </Route>
                    {/* <Redirect to="/home" /> */}
                </BrowserRouter>
            </GlobalState>
        );
    }
}

export default App;
