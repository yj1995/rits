import React, { Component } from 'react';
import styles from './styles';
import axios from 'axios';
import moment from 'moment';
import { apiUrl } from "../../../config";
import FollowUpList from '../../FollowUp/FollowUpList/index';
import UserAssign from '../../UserData/UserAssign/index';

// Material components
import {
    Grid,
    Button,
    IconButton,
    CircularProgress,
    TextField,
    Typography,
    Textarea
} from '@material-ui/core';

import validate from 'validate.js';
import _ from 'underscore';
import schema from '../schema';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Material helpers
import { withStyles } from '@material-ui/core';

const states = [
    {
        value: 'Select Source',
        label: 'Select Source'
    },
    {
        value: 'JustDail',
        label: 'JustDail'
    },
    {
        value: 'Reference',
        label: 'Reference'
    },
    {
        value: 'Walk-In',
        label: 'Walk-In'
    },
    {
        value: 'Google',
        label: 'Google'
    },
    {
        value: 'YouTube',
        label: 'YouTube'
    },
    {
        value: 'Sulekha',
        label: 'Sulekha'
    }
];

const status = [
    {
        value: 'Select Status',
        label: 'Select Status'
    },
    {
        value: 'Qualified',
        label: 'Qualified'
    },
    {
        value: 'Hot',
        label: 'Hot'
    },
    {
        value: 'Won',
        label: 'Won'
    },
    {
        value: 'Lost',
        label: 'Lost'
    }
];

class LeadDetail extends Component {
    constructor(props) {
        super(props);
        this.userData = JSON.parse(localStorage.getItem('productDetails'));
        let date = this.userData.requiredDate ? this.userData.requiredDate : '';
        let data;
        let time;
        if (date) {
            date = moment(new Date(date)).format('MM/DD/YYYY hh:mm a');
            date = date.split(' ');
            data = date[0].split('/');
            if (date[2] == 'pm' && date[0] < 12) {
                time = date[1].replace(date[1].split(':')[0], Number(date[1].split(':')[0]) + 12);
            } else {
                time = date[1];
            }
        }
        this.state = {
            edit: false,
            values: {
                name: this.userData.name,
                email: this.userData.email,
                mobileno: this.userData.mobileno.substring(this.userData.mobileno.length - 10, this.userData.mobileno.length),
                source: this.userData.source,
                requirement: this.userData.requirement,
                followupDate: data ? data[2] + '-' + data[0] + '-' + data[1] : '',
                followUpTime: time,
                requiredDate: this.userData.requiredDate,
                address: this.userData.address,
                deal: this.userData.deal,
                status: this.userData.status,
                companyName: this.userData.companyName
            },
            touched: {
                email: false,
                mobileno: false,
                name: false,
                source: false
            },
            errors: {
                email: null,
                mobileno: null,
                name: null,
                source: null
            },
            isValid: true,
            isPhone: '',
            isFollowUp: '',
            isAssign: ''
        };
        console.log(this.state.values, date);
    }
    validateForm = _.debounce(() => {
        const { values } = this.state;

        const newState = { ...this.state };
        const errors = validate(values, schema);
        newState.errors = errors || {};
        newState.isValid = errors ? false : true;

        this.setState(newState);

    }, 300);

    handleFieldChange = (field, value) => {
        const newState = { ...this.state };

        newState.submitError = null;
        newState.touched[field] = true;
        newState.values[field] = value;

        this.setState(newState, this.validateForm);

    };


    followup() {
        if (this.state.isPhone) {
            let { history } = this.props;
            history.push('/follow-up-list');
        } else {
            document.querySelector('.header').innerText = 'Follow Up';
            this.setState({ isFollowUp: true });
        }
    }

    editDetail(e) {
        let type = e.target.innerHTML;
        if (type == 'EDIT') {
            e.target.innerHTML = 'SAVE';
            this.setState({ edit: true });
        } else if (type == 'SAVE') {
            let {
                name,
                email,
                mobileno,
                source,
                requirement,
                followupDate,
                followUpTime,
                requiredDate,
                address,
                deal,
                status,
                companyName
            } = this.state.values;
            let date = followupDate + ' ' + followUpTime;
            let data = { name, email, mobileno, source, requirement, requiredDate, address, deal, status, companyName };
            let type = this.userData.mobileno ? 'mobileno' : 'name';
            console.log(data);
            axios.post(`${apiUrl}api/update`, { [type]: this.userData[type], userId: this.userData.id, leadId: localStorage.getItem('followLeadId'), data }).then(res => {
                alert('Lead updated successfully');
                console.log(res.data);
                if (res.data.status === 1) {
                    console.log('res', res)
                    document.querySelector('#Edit').textContent = 'EDIT';
                    this.setState({ edit: false });
                }
            })

        }
    }

    delete() {
        let { history } = this.props;
        let type = this.userData.mobileno ? 'mobileno' : 'name';
        axios.post(`${apiUrl}api/delete`, { [type]: this.userData[type] }).then(res => {
            if (res.data.status === 1) {
                console.log('res', res)
                alert('Lead deleted successfully');
                history.push('/products');
            }
        })
    }

    assign() {
        if (this.state.isPhone) {
            let { history } = this.props;
            history.push('/UserAssign');
        } else {
            document.querySelector('.header').innerText = 'Assign Lead Page';
            this.setState({ isAssign: true });
        }
    }

    handleChange = (e, key) => {
        const newState = { ...this.state };
        newState.values[key] = e.target.value;
        this.setState(newState);
    };

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
    }

    renderDetails(classes, present = false) {
        const {
            values,
            touched,
            errors,
            isValid
        } = this.state;
        const showEmailError = touched.email && errors.email;
        const showMobileError = touched.mobileno && errors.mobileno;
        const showNameError = touched.name && errors.name;
        const showSourceError = touched.source && errors.source;
        return (
            <React.Fragment>
                <Grid className={classes.content} item lg={7} xs={12}>
                    <div className={classes.content} style={{ height: present ? window.innerHeight : window.innerHeight - 55 - 63 }}>
                        <form className={classes.form} style={{ padding: present ? 10 : '0px 16px', width: present ? 500 : null, marginTop: present ? 60 : null, marginBottom: present ? 60 : 80 }}>
                            <div className={classes.fields}>
                                <TextField
                                    InputLabelProps={{ style: { color: 'black' } }}
                                    InputProps={{ style: { color: '#66788A' } }}
                                    className={classes.textField}
                                    label="CUSTOMER NAME"
                                    name="Name"
                                    onChange={event =>
                                        this.handleFieldChange('name', event.target.value)
                                    }
                                    type="text"
                                    value={values.name}
                                    variant="outlined"
                                    disabled={this.state.edit ? false : true}
                                />
                                {showNameError && (
                                    <Typography
                                        className={classes.fieldError}
                                        variant="body2"
                                    >
                                        {errors.name[0]}
                                    </Typography>
                                )}
                            </div>
                            <div className={classes.fields}>
                                <TextField
                                    InputLabelProps={{ style: { color: 'black' } }}
                                    className={classes.textField}
                                    InputProps={{ style: { color: '#66788A' } }}
                                    label="CUSTOMER MOBILE NUMBER"
                                    name="Mobile"
                                    onChange={event =>
                                        this.handleFieldChange('mobileno', event.target.value)
                                    }
                                    type="number"
                                    value={values.mobileno}
                                    variant="outlined"
                                    maxLength="10"

                                    disabled={this.state.edit ? false : true}
                                />
                                {showMobileError && (
                                    <Typography
                                        className={classes.fieldError}
                                        variant="body2"
                                    >
                                        {errors.mobileno[0]}
                                    </Typography>
                                )}
                            </div>
                            <div className={classes.fields}>
                                <TextField
                                    InputLabelProps={{ style: { color: 'black' } }}
                                    InputProps={{ style: { color: '#66788A' } }}
                                    className={classes.textField}
                                    label="CUSTOMER EMAIL"
                                    name="Email"
                                    onChange={event =>
                                        this.handleFieldChange('email', event.target.value)
                                    }
                                    type="text"
                                    value={values.email}
                                    variant="outlined"

                                    disabled={this.state.edit ? false : true}
                                />
                                {showEmailError && (
                                    <Typography
                                        className={classes.fieldError}
                                        variant="body2"
                                    >
                                        {errors.email[0]}
                                    </Typography>
                                )}
                            </div>
                            <div className={classes.fields}>
                                <TextField
                                    style={{ width: '100%' }}
                                    label="Source"
                                    margin="dense"
                                    disabled={this.state.edit ? false : true}
                                    onChange={(e) => this.handleChange(e, 'source')}
                                    select
                                    SelectProps={{ native: true, style: { height: 56 } }}
                                    InputLabelProps={{ shrink: true, style: { padding: '8px 0px', fontSize: '1rem' } }}
                                    value={values.source}
                                    variant="outlined">
                                    {states.map(option => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                            style={{ margin: 10, fontSize: 16 }}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>
                            </div>
                            <div className={classes.fields}>
                                <TextField
                                    InputLabelProps={{ style: { color: 'black' } }}
                                    InputProps={{ style: { color: '#66788A' } }}
                                    className={classes.textField}
                                    label="CUSTOMER COMPANY NAME"
                                    name="customer company name"
                                    onChange={event =>
                                        this.handleFieldChange('companyName', event.target.value)
                                    }
                                    type="text"
                                    value={values.companyName}
                                    variant="outlined"

                                    disabled={this.state.edit ? false : true}
                                />
                            </div>
                            <div className={classes.fields}>
                                <TextField
                                    InputLabelProps={{ style: { color: 'black' } }}
                                    InputProps={{ style: { color: '#66788A' } }}
                                    className={classes.textField}
                                    multiline={true}
                                    rows={6}
                                    rowsMax={8}
                                    label="CUSTOMER REQUIREMENT"
                                    name="Requirement"
                                    onChange={event =>
                                        this.handleFieldChange('requirement', event.target.value)
                                    }
                                    type="text"
                                    value={values.requirement}
                                    variant="outlined"

                                    disabled={this.state.edit ? false : true}
                                />
                            </div>
                            <div className={classes.fields}>
                                <TextField
                                    InputLabelProps={{ style: { color: 'black' } }}
                                    InputProps={{ style: { color: '#66788A' } }}
                                    className={classes.textField}
                                    multiline={true}
                                    rows={6}
                                    rowsMax={8}
                                    label="CUSTOMER ADDRESS"
                                    name="Address"
                                    onChange={event =>
                                        this.handleFieldChange('address', event.target.value)
                                    }
                                    type="text"
                                    value={values.address}
                                    variant="outlined"

                                    disabled={this.state.edit ? false : true}
                                />
                            </div>
                            <div className={classes.fields}>
                                <TextField
                                    style={{ width: '100%' }}
                                    label="STATUS"
                                    disabled={this.state.edit ? false : true}
                                    margin="dense"
                                    onChange={(e) => this.handleChange(e, 'status')}
                                    select
                                    SelectProps={{ native: true, style: { height: 56 } }}
                                    InputLabelProps={{ shrink: true, style: { padding: '8px 0px', fontSize: '1rem' } }}
                                    value={values.status}
                                    variant="outlined">
                                    {status.map(option => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                            style={{ margin: 10, fontSize: 16 }}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>
                            </div>
                            <div className={classes.fields}>
                                <TextField
                                    className={classes.textField}
                                    label="DEAL AMOUNT"
                                    disabled={this.state.edit ? false : true}
                                    name="deal"
                                    onChange={event =>
                                        this.handleFieldChange('deal', event.target.value)
                                    }
                                    type="number"
                                    value={values.deal}
                                    variant="outlined"
                                />
                            </div>
                            {/* <div className={classes.fields}>
                                <TextField
                                    InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                                    className={classes.textField}
                                    label="FOLLOW UP DATE"
                                    name="followUpDate"
                                    InputProps={{ inputProps: { min: new Date().getFullYear() + '-0' + (new Date().getMonth() + 1) + '-' + new Date().getDate() }, style: { color: '#66788A' } }}
                                    onChange={event =>
                                        this.handleFieldChange('followupDate', event.target.value)
                                    }
                                    type="date"
                                    variant="outlined"
                                    defaultValue={values.followupDate}
                                    disabled={this.state.edit ? false : true}
                                />
                            </div>
                            <div className={classes.fields}>
                                <TextField
                                    style={{ color: 'black' }}
                                    InputProps={{ style: { color: '#66788A' } }}
                                    InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                                    className={classes.textField}
                                    label="FOLLOW UP TIME"
                                    name="followUpTime"
                                    onChange={event =>
                                        this.handleFieldChange('followUpTime', event.target.value)
                                    }
                                    type="time"
                                    value={values.followUpTime ? values.followUpTime : '00:00'}
                                    variant="outlined"

                                    disabled={this.state.edit ? false : true}
                                />
                            </div> */}
                            <div className={classes.fields}>
                                <button className={classes.follow} style={{ width: '100%', height: 48 }} onClick={() => this.followup()}>VIEW FOLLOW UP</button>
                            </div>
                        </form>
                    </div>
                </Grid>
                <div className={classes.bottomButtonHolder} style={{ width: present ? 500 : null, right: present ? 0 : null, left: present ? 'unset' : null }}>
                    <button id='Edit' disabled={!isValid} style={{ backgroundColor: !isValid ? '#DFE3E8' : '#0767DB', borderRight: '1px solid #DFE3E8' }} className={classes.buttonLocation}
                        onClick={(e) => {
                            e.stopPropagation();
                            this.editDetail(e);
                        }}>EDIT</button>
                    <button className={classes.buttonLocation} onClick={(e) => {
                        e.stopPropagation();
                        this.assign();
                    }}>ASSIGN</button>
                </div>
            </React.Fragment >
        )
    }

    render() {
        const { classes } = this.props;
        const { isPhone, isFollowUp, isAssign } = this.state;
        return (
            !isAssign ? (!isFollowUp ? (isPhone ?
                <DashboardLayout title="LEAD DETAILS">
                    {this.renderDetails(classes)}
                </DashboardLayout> : this.renderDetails(classes, true)
            ) : <FollowUpList />) : <UserAssign isPhone />
        )
    }
}

export default withStyles(styles)(LeadDetail);