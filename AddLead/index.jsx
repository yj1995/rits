import React, { Component } from 'react';
import styles from './styles';
import axios from 'axios';
import moment from 'moment';
import { apiUrl } from "../../config";

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
import schema from './schema';

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

class AddLead extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                name: '',
                email: '',
                mobileno: '',
                source: '',
                requirement: '',
                followupDate: '',
                followUpTime: '',
                requiredDate: '',
                address: '',
                status: '',
                deal: '',
                companyName: ''
            },
            touched: {
                // email: false,
                mobileno: false,
                name: false,
                // source: false
            },
            errors: {
                // email: null,
                mobileno: null,
                name: null,
                // source: null
            },
            isValid: false,
            isPhone: ''
        };
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

    save() {
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
        let { history } = this.props;
        let date = followupDate + ' ' + followUpTime;

        requiredDate = new Date().toISOString();
        let isAdded = true
        const userData = JSON.parse(localStorage.getItem('userData'));
        const typeOfuser = userData.typeofUser ? 'assignedUser' : 'userId';
        const query = typeOfuser === 'assignedUser' ? { assignedUser: userData._id, userId: userData.createdUserId, assignedUserName: userData.name } : { userId: userData._id };
        const data = { name, email, mobileno, source, requirement, requiredDate, isAdded, address, deal, status, companyName };
        axios.post(`${apiUrl}api/addMailData`, { query, data }).then(res => {
            if (res.data.status === 1) {
                // let followTime = new Date(date).toISOString();
                // // let userId = res.data.data._id; 
                // let userId = res.data.data.userId;             //puneet code
                // let leadId = res.data.data._id;
                // data = {
                //     followTime,
                //     leadId,
                //     userId
                // }
                // axios.post(`${apiUrl}api/followup/add`, data).then(res => {
                //     if (res.data.status === 1) {
                //         console.log('res', res)
                //         alert('Lead added successfully');
                //         if (this.state.isPhone) {
                //             history.push('/products');
                //         } else {
                //             this.setState({
                //                 values: {
                //                     name: '',
                //                     email: '',
                //                     mobileno: '',
                //                     source: '',
                //                     requirement: '',
                //                     followupDate: '',
                //                     followUpTime: '',
                //                     requiredDate: '',
                //                     address: ''
                //                 },
                //                 isValid: ''
                //             })
                //         }
                //     }
                // })
                console.log('res', res)
                alert('Lead added successfully');
                if (this.state.isPhone) {
                    history.push('/products');
                } else {
                    this.setState({
                        values: {
                            name: '',
                            email: '',
                            mobileno: '',
                            source: '',
                            requirement: '',
                            followupDate: '',
                            followUpTime: '',
                            requiredDate: '',
                            address: '',
                            deal: '',
                            status: '',
                            companyName: ''
                        },
                        isValid: ''
                    })
                }
            }
        })
    }

    handleChange = (e, key) => {
        const newState = { ...this.state };
        newState.values[key] = e.target.value;
        this.setState(newState);
    };

    renderForm(values, touched, errors, classes, isValid = false, present = !this.state.isPhone) {
        // const showEmailError = touched.email && errors.email;
        const showMobileError = touched.mobileno && errors.mobileno;
        const showNameError = touched.name && errors.name;
        // const showSourceError = touched.source && errors.source;
        return (
            <div className={classes.content} style={{ height: present ? window.innerHeight : window.innerHeight - 55 - 63 }}>
                <form className={classes.form} style={{ padding: present ? 10 : '0px 16px', width: present ? 500 : null, marginTop: present ? 60 : null, marginBottom: present ? 60 : 80 }}>
                    <div className={classes.fields}>
                        <TextField
                            className={classes.textField}
                            label="CUSTOMER NAME"
                            name="Name"
                            onChange={event =>
                                this.handleFieldChange('name', event.target.value)
                            }
                            type="text"
                            value={values.name}
                            required
                            variant="outlined"
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
                            className={classes.textField}
                            label="CUSTOMER MOBILE NUMBER"
                            name="Mobile"
                            onChange={event =>
                                this.handleFieldChange('mobileno', event.target.value)
                            }
                            type="number"
                            value={values.mobileno}
                            variant="outlined"
                            maxLength="10"
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
                            className={classes.textField}
                            label="CUSTOMER EMAIL"
                            name="Email"
                            onChange={event =>
                                this.handleFieldChange('email', event.target.value)
                            }
                            type="text"
                            value={values.email}
                            variant="outlined"
                        />
                        {/* {showEmailError && (
                            <Typography
                                className={classes.fieldError}
                                variant="body2"
                            >
                                {errors.email[0]}
                            </Typography>
                        )} */}
                    </div>
                    <div className={classes.fields}>
                        <TextField
                            style={{ width: '100%' }}
                            label="SOURCE"
                            margin="dense"
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
                            className={classes.textField}
                            multiline={true}
                            rows={6}
                            rowsMax={8}
                            label="CUSTOMER ADDRESS"
                            name="address"
                            onChange={event =>
                                this.handleFieldChange('address', event.target.value)
                            }
                            type="text"
                            value={values.address}
                            variant="outlined"
                        />
                    </div>
                    <div className={classes.fields}>
                        <TextField
                            className={classes.textField}
                            label="CUSTOMER COMPANY NAME"
                            name="customer company name"
                            onChange={event =>
                                this.handleFieldChange('companyName', event.target.value)
                            }
                            type="text"
                            value={values.companyName}
                            variant="outlined"
                        />
                    </div>
                    <div className={classes.fields}>
                        <TextField
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
                        />
                    </div>
                    {/* <div className={classes.fields}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            className={classes.textField}
                            label="FOLLOW UP DATE"
                            name="followUpDate"
                            InputProps={{ inputProps: { min: new Date().getFullYear() + '-0' + (new Date().getMonth() + 1) + '-' + new Date().getDate() } }}
                            onChange={event =>
                                this.handleFieldChange('followupDate', event.target.value)
                            }
                            type="date"
                            value={values.followupDate}
                            variant="outlined"
                        />
                    </div>
                    <div className={classes.fields}>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            className={classes.textField}
                            label="FOLLOW UP TIME"
                            name="followUpTime"
                            onChange={event =>
                                this.handleFieldChange('followUpTime', event.target.value)
                            }
                            type="time"
                            value={values.followUpTime ? values.followUpTime : '00:00'}
                            variant="outlined"
                        />
                    </div> */}
                    <div className={classes.fields}>
                        <TextField
                            style={{ width: '100%' }}
                            label="STATUS"
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
                            name="deal"
                            onChange={event =>
                                this.handleFieldChange('deal', event.target.value)
                            }
                            type="number"
                            value={values.deal}
                            variant="outlined"
                        />
                    </div>
                </form>
                {present ? <Button disabled={!isValid} style={{ backgroundColor: !isValid ? '#DFE3E8' : '#0767DB', width: 500, right: 0, left: 'unset' }} className={classes.saveButton} onClick={() => this.save()} >SAVE</Button> : ''}
            </div>
        )
    }

    componentWillMount() {
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

    render() {
        console.log(this.state.isPhone);
        const { classes } = this.props;
        let present = '';
        const {
            values,
            touched,
            errors,
            isValid
        } = this.state;
        return (
            this.state.isPhone ? <DashboardLayout title="ADD LEAD DETAILS">
                <Grid className={classes.content} item lg={7} xs={12} >
                    {this.renderForm(values, touched, errors, classes)}
                </Grid>
                <Button disabled={!isValid} style={{ backgroundColor: !isValid ? '#DFE3E8' : '#0767DB' }} className={classes.saveButton} onClick={() => this.save()}>SAVE</Button>
            </DashboardLayout> : this.renderForm(values, touched, errors, classes, isValid)
        );
    }
}

export default withStyles(styles)(AddLead);