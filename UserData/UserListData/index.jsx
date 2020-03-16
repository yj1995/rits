import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import { apiUrl } from "../../../config";
import classNames from 'classnames';
import { Row, Col, Button } from 'reactstrap';
// Material helpers
import { withStyles, Grid, CircularProgress } from '@material-ui/core';
// import SearchBar from 'material-ui-search-bar';

// Shared components
import { Paper } from 'components';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Component styles
import styles from './styles';

class UserListData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: [],
            isLoading: false
        }
    }

    componentDidMount() {
        let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {};
        axios.post(`${apiUrl}api/getUsers`, { UserId: userData._id }).then(res => {
            console.log(res.data, 'users');
            if (res.data.status === 1) {
                this.setState({ user: res.data.data, isLoading: true });
            } else {
                this.setState({ isLoading: true });
            }
        })
    }

    detectmob() {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            return true;
        } else {
            return false;
        }
    }

    renderuser() {
        const { classes, className } = this.props;
        let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {};
        const rootClassName = classNames(classes.root, className);
        if (this.state.user.length) {
            let data = [];
            this.state.user.map((user, i) => {
                if (userData.mobileno != user.mobileno) {
                    data.push(
                        <Grid
                            item
                            key={`user` + user.id}
                            lg={4}
                            md={6}
                            xs={12}
                        >
                            < Paper className={rootClassName} >
                                <Row style={{ margin: 0 }}>
                                    <Col xs="3" style={{ paddingRight: 0, maxWidth: typeof window.orientation !== 'undefined' ? 68 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 68px" : null }}>Name: </Col>
                                    <Col xs="8" style={{ wordWrap: 'break-word', padding: 0 }}>{user.name ? user.name : ''}</Col>
                                </Row>
                                <Row style={{ margin: 0 }}>
                                    <Col xs="3" style={{ paddingRight: 0, maxWidth: typeof window.orientation !== 'undefined' ? 76 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 76px" : null }}>Mobile: </Col>
                                    <Col xs="8" style={{ wordWrap: 'break-word', padding: 0 }}>{user.mobileno}</Col>

                                </Row>
                                <Row style={{ margin: 0 }}>
                                    <Col xs="3" style={{ paddingRight: 0, maxWidth: typeof window.orientation !== 'undefined' ? 66 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 66px" : null }}>Email: </Col>
                                    <Col xs="8" style={{ wordWrap: 'break-word', padding: 0 }}>{user.email}</Col>
                                </Row>
                                <Row style={{ paddingBottom: 5, margin: 0 }}>
                                    <Col xs="6" style={{ maxWidth: typeof window.orientation !== 'undefined' ? 123 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 123px" : null, paddingRight: 0 }}>Type Of User: </Col>
                                    <Col xs="5" style={{ wordWrap: 'break-word', padding: 0 }}>{user.typeofUser}</Col>
                                </Row>
                            </Paper >
                        </Grid>
                    )
                }
            })
            return data;
        }
        if (!this.state.isLoading) {
            return (<div className={classes.progressWrapper}>
                <CircularProgress />
            </div>)
        }
        return (<Paper className={rootClassName} style={{ height: 50, width: '100%' }}>
            <Row style={{ margin: 0, marginTop: 5 }}>
                <Col xl="12" style={{ textAlign: "center" }}>There are no user</Col>
            </Row></Paper >)
    }

    user() {
        let { history } = this.props;
        history.push('/UserData');
    }

    render() {
        const { classes } = this.props;
        return (
            <DashboardLayout title="Users">
                {/* <SearchBar
                    onChange={() => console.log('onChange')}
                    onRequestSearch={() => console.log('onRequestSearch')}
                    style={{
                        margin: '0 auto',
                        maxWidth: 800
                    }}
                    spellCheck = {true}
                /> */}
                <div className={classes.root} style={{ overflowY: this.detectmob() ? this.state.user.length > 5 ? 'auto' : 'hidden' : 'auto', height: window.innerHeight - 55 - 63 }}>
                    <div className={classes.content}>
                        <Grid
                            container
                            spacing={3}
                            style={{ height: '100%', display: 'block' }}
                        >
                            {this.renderuser()}
                        </Grid>
                    </div>
                    <Button className={classes.saveButton} onClick={() => this.user()}>+ ADD USER</Button>
                </div>
            </DashboardLayout>
        )
    }
}


export default withStyles(styles)(UserListData);