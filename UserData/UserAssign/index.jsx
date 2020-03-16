import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import { apiUrl } from "../../../config";
import classNames from 'classnames';
import { Row, Col, Button } from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
// Material helpers
import { withStyles, Grid, CircularProgress } from '@material-ui/core';
// import SearchBar from 'material-ui-search-bar';

// Shared components
import { Paper } from 'components';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Component styles
import styles from './styles';

class UserAssign extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: [],
            isLoading: false,
            enabled: false,
            isPhone: ''
        }
        this.checked = [];
    }

    componentDidMount() {
        this.setState({ isPhone: detectmob() })
        function detectmob() {
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
        let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {};
        axios.post(`${apiUrl}api/getUsers`, { UserId: userData._id }).then(res => {
            console.log(res.data, 'users');
            if (res.data.status === 1) {
                this.setState({ user: res.data.data, isLoading: true });
            } else {
                this.setState({ isLoading: true });
            }
        })
        console.log(this.state.user);
    }

    clickCheckbox(e) {
        const click = e.target.getAttribute('value');
        if (!this.checked.length && this.checked.indexOf(click) == -1) {
            this.checked.push(click);
        } else if (this.checked.indexOf(click)) {
            this.checked.splice(this.checked.indexOf(click), 1);
        } else {
            this.checked.push(click);
        }
        if (this.checked.length === 1) {
            this.setState({ enabled: true });
        } else {
            this.setState({ enabled: false });
        }
    }

    renderuser(present) {
        const { classes, className } = this.props;
        const rootClassName = classNames(classes.root, className);
        let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {};
        if (this.state.user.length) {
            let data = [];
            this.state.user.map((user, i) => {
                if (user.mobileno != userData.mobileno) {
                    data.push(
                        <Grid
                            item
                            key={`user` + user.id}
                            lg={4}
                            md={6}
                            xs={12}
                            style={{ position: present ? 'relative' : null, maxWidth: present ? '85%' : null, left: present ? '50%' : null, transform: present ? 'translate(-50%)' : null }}
                        >
                            < Paper className={rootClassName} >
                                <div key={'list' + i} className={classes.fields} style={{ border: '1px solid rgba(0, 0, 0, 0.23)', height: 56 }}>
                                    <span style={{ position: 'relative', fontSize: 14, float: 'left', margin: 15 }}>{user.name}</span>
                                    <Checkbox value={user.name} color='primary' style={{ float: 'right', borderLeft: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: 0, height: '100%' }} onClick={(e) => this.clickCheckbox(e)} />
                                </div>
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
        return (< Paper className={rootClassName} style={{ height: 50, width: this.state.isPhone ? '100%' : '85%', margin: !this.state.isPhone ? '80px 0px' : null, left: !this.state.isPhone ? '50%' : null, transform: !this.state.isPhone ? 'translateX(-50%)' : null, position: !this.state.isPhone ? 'relative' : null }}>
            <Row style={{ margin: 0, marginTop: 5 }}>
                <Col xl="12" style={{ textAlign: "center" }}>There are no user</Col>
            </Row></Paper>)
    }

    renderAssign(classes, present = !this.state.isPhone) {
        const display = present ? 6 : 7;
        return (
            <div className={classes.root} style={{ overflowY: this.state.user.length > display ? 'auto' : 'hidden', height: window.innerHeight - 55 - 63, width: present ? 500 : null, marginTop: present ? 60 : null, marginBottom: present ? 60 : null }}>
                <div className={classes.content}>
                    <Grid
                        container
                        spacing={3}
                        style={{ height: '100%', display: 'block' }}
                    >
                        {this.renderuser(present)}
                    </Grid>
                </div>
                <Button disabled={!this.state.enabled} style={{ backgroundColor: !this.state.enabled ? '#DFE3E8' : '#0767DB', width: present ? 500 : null, right: present ? 0 : null, left: present ? 'unset' : null }} className={classes.saveButton} onClick={() => this.user()}>SAVE</Button>
            </div>
        )
    }
    user() {
        let { history } = this.props;
        const user = this.state.user.filter((val) => {
            return val.name == this.checked[0]
        });
        console.log(user);
        axios.post(`${apiUrl}api/assignUser`, { leadId: localStorage.getItem('followLeadId'), userId: user[0]._id, name: user[0].name }).then(res => {
            console.log(res.data, 'users');
            if (res.data.status === 1) {
                alert('user assigned');
                if (this.state.isPhone) {
                    history.push('/products');
                }
            }
        })
    }

    render() {
        const { classes } = this.props;
        return (
            this.state.isPhone ?
                <DashboardLayout title="Assign Lead Page">
                    {/* <SearchBar
                    onChange={() => console.log('onChange')}
                    onRequestSearch={() => console.log('onRequestSearch')}
                    style={{
                        margin: '0 auto',
                        maxWidth: 800
                    }}
                    spellCheck = {true}
                /> */}
                    {this.renderAssign(classes)}
                </DashboardLayout> : this.renderAssign(classes)
        )
    }
}


export default withStyles(styles)(UserAssign);