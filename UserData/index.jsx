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

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Material helpers
import { withStyles } from '@material-ui/core';

const states = [
    {
        value: 'Admin',
        label: 'Admin'
    },
    {
        value: 'SubUser',
        label: 'SubUser'
    }
];

class UserData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                name: '',
                email: '',
                mobileno: '',
                source: '',
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
            isValid: false
        };
        this.Checkboxlist = ['SETTINGS', 'DASHBOARDS', 'LEADS', 'CALENDAR', 'CALENDAR/BOOKINGS'];
    }
    validateForm = _.debounce(() => {
        const { values } = this.state;

        const newState = { ...this.state };
        const errors = validate(values, schema);
        newState.errors = errors || {};
        newState.isValid = errors ? false : true;

        this.setState(newState);

    }, 300);

    handleChange = e => {
        const newState = { ...this.state };
        newState.values['source'] = e.target.value;
        this.setState(newState);
    };

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
        } = this.state.values;
        let { history } = this.props;
        let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {};
        axios.post(`${apiUrl}api/user/add`, { createdUserId: userData._id, name, email, mobileno, typeofUser: source, roles: ['LEADS'] }).then(res => {
            alert('User added successfully');
            history.push('/UserListData');
        })
    }

    Checkbox(classes) {
        let data = [];
        this.Checkboxlist.map((list, i) => {
            data.push(
                <div key={'list' + i} className={classes.fields} style={{ border: '1px solid rgba(0, 0, 0, 0.23)', height: 56 }}>
                    <span style={{ position: 'absolute', padding: 15, fontSize: 14 }}>{list}</span>
                    <Checkbox value={list} color='primary' style={{ float: 'right', borderLeft: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: 0, height: '100%' }} />
                </div>
            )
        })
        return data;
    }
    render() {
        const { classes } = this.props;
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
            <DashboardLayout title="ADD USER">
                <Grid className={classes.content} item lg={7} xs={12} style={{ height: window.innerHeight - 55 - 63 }}>
                    <div className={classes.content} style={{ height: '100%' }}>
                        <form className={classes.form}>
                            <div className={classes.fields}>
                                <TextField
                                    className={classes.textField}
                                    label="USER NAME"
                                    name="Name"
                                    onChange={event =>
                                        this.handleFieldChange('name', event.target.value)
                                    }
                                    type="text"
                                    value={values.name}
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
                                    label="USER MOBILE NUMBER"
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
                                    label="USER EMAIL"
                                    name="Email"
                                    onChange={event =>
                                        this.handleFieldChange('email', event.target.value)
                                    }
                                    type="text"
                                    value={values.email}
                                    variant="outlined"
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
                                    label="Type Of User"
                                    margin="dense"
                                    onChange={this.handleChange}
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
                                {showSourceError && (
                                    <Typography
                                        className={classes.fieldError}
                                        variant="body2"
                                    >
                                        {errors.source[0]}
                                    </Typography>
                                )}
                            </div>
                            {/* {this.Checkbox(classes)} */}
                        </form>
                    </div>
                </Grid>
                <Button disabled={!isValid} style={{ backgroundColor: !isValid ? '#DFE3E8' : '#0767DB' }} className={classes.saveButton} onClick={() => this.save()}>SAVE</Button>
            </DashboardLayout>
        )
    }
}

export default withStyles(styles)(UserData);