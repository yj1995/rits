import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import { apiUrl } from "../../../config";
import classNames from 'classnames';
import { Row, Col, Button } from 'reactstrap';
// Material helpers
import { withStyles, Grid, CircularProgress } from '@material-ui/core';
import FollowUp from '../index';
// import SearchBar from 'material-ui-search-bar';

// Shared components
import { Paper } from 'components';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Component styles
import styles from './styles';

class FollowUpList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            followup: [],
            isLoading: false,
            isPhone: '',
            isAddFollow: ''
        }
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
        let leadId = localStorage.getItem('followLeadId') ? localStorage.getItem('followLeadId') : ""
        console.log(leadId, 'leadId')
        if (leadId) {
            axios.post(`${apiUrl}api/followup/get`, { leadId: leadId }).then(res => {
                console.log(res.data, 'followups');
                if (res.data.status === 1) {
                    this.setState({ followup: res.data.data, isLoading: true });

                } else {
                    this.setState({ isLoading: true });
                }
            })
        }
    }

    renderFollowUp(present = !this.state.isPhone) {
        console.log(present, 'present');
        const { classes, className } = this.props;
        const rootClassName = classNames(classes.root, className);
        if (this.state.followup.length) {
            let data = [];
            let sort = this.state.followup.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.followTime) - new Date(a.followTime);
            });
            sort.map((followup, i) => {
                data.push(
                    <Grid
                        item
                        key={`followup` + followup.id}
                        lg={4}
                        md={6}
                        xs={12}
                        style={{ position: present ? 'relative' : null, maxWidth: present ? '85%' : null, left: present ? '50%' : null, transform: present ? 'translate(-50%)' : null }}
                    >
                        < Paper className={rootClassName}>
                            <Row style={{ margin: 0, marginTop: 5 }}>
                                <Col xs={present ? 3 : 4} style={{ paddingRight: 0, maxWidth: typeof window.orientation !== 'undefined' ? 93 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 93px" : null }}>Comment: </Col>
                                <Col xs={present ? 8 : 7} style={{ wordWrap: 'break-word', padding: 0 }}>{followup.comment ? followup.comment : ''
                                }
                                </Col>
                            </Row>
                            <Row style={{ margin: 0, marginTop: 5 }}>
                                <Col xs="2" style={{ paddingRight: 0, maxWidth: typeof window.orientation !== 'undefined' ? 57 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 57px" : null }}>Date: </Col>
                                <Col xs="9" style={{ wordWrap: 'break-word', padding: 0 }}>{followup.followTime ?
                                    moment(new Date(new Date(followup.followTime).setHours(new Date(followup.followTime).getHours())).setMinutes(new Date(followup.followTime).getMinutes())).format('DD/MM/YYYY hh:mm a') : ''
                                }
                                </Col>
                            </Row>
                        </Paper >
                    </Grid>
                )
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
                <Col xl="12" style={{ textAlign: "center" }}>There are no FollowUp</Col>
            </Row></Paper>)
    }

    followup() {
        if (this.state.isPhone) {
            console.log('fhjfhjfhj');
            let { history } = this.props;
            history.push('/follow-up');
        } else {
            this.setState({ isAddFollow: true });
        }
    }

    render() {
        const { classes } = this.props;
        const { isPhone, isAddFollow } = this.state;
        const total = isPhone ? 7 : 6;
        return (
            !isAddFollow ? (isPhone ?
                <DashboardLayout title="Follow Up">
                    {/* <SearchBar
                    onChange={() => console.log('onChange')}
                    onRequestSearch={() => console.log('onRequestSearch')}
                    style={{
                        margin: '0 auto',
                        maxWidth: 800
                    }}
                    spellCheck = {true}
                /> */}
                    <div className={classes.root} style={{ overflowY: this.state.followup.length > total ? 'auto' : 'hidden', height: window.innerHeight - 55 - 63 }}>
                        <div className={classes.content}>
                            <Grid
                                container
                                spacing={3}
                                style={{ height: '100%', display: 'block' }}
                            >
                                {this.renderFollowUp()}
                            </Grid>
                        </div>
                        <Button className={classes.saveButton} onClick={() => this.followup()}>+ ADD FOLLOW UP</Button>
                    </div>
                </DashboardLayout> : <div className={classes.root} style={{ overflowY: this.state.followup.length > 7 ? 'auto' : 'hidden', height: window.innerHeight, width: 500 }}>
                    <div className={classes.content} style={{ marginBottom: 60 }}>
                        <Grid
                            container
                            spacing={3}
                            style={{ height: '100%', display: 'block', margin: '70px 0px' }}
                        >
                            {this.renderFollowUp()}
                        </Grid>
                    </div>
                    <Button className={classes.saveButton} onClick={() => this.followup()} style={{ width: 500, right: 0, left: 'unset' }}>+ ADD FOLLOW UP</Button>
                </div>) : <FollowUp />
        )
    }
}


export default withStyles(styles)(FollowUpList);