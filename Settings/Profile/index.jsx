import React, { Component } from 'react';
import styles from './styles';
import TextfieldC from './TextfieldC';
// Material components
import {
    Grid,
    Button,
    Container,
    Typography,
    TextField
} from '@material-ui/core';
import validate from 'validate.js';
import _ from 'underscore';
import schema from './schema';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Material helpers
import { withStyles, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { apiUrl } from "../../../config";

var userData = JSON.parse(localStorage.getItem('userData'));

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                name: '',
                email: '',
                mobileno: '',
                alternateNo: '',
                gst: '',
                companyName: '',
                address: ''
                // date: '',
                // renewalDate: ''
            },
            touched: {
                name: false,
                email: false,
                mobileno: false,
                alternateNo: false,
                // date: false,
                // renewalDate: false,
            },
            errors: {
                name: false,
                email: null,
                mobileno: null,
                alternateNo: false,
                // date: false,
                // renewalDate: false,
            },
            isValid: false,
            edit: true,
            isLoading: false,
        };
    }

    validateForm = _.debounce(() => {
        const { values } = this.state;
        const newState = { ...this.state };
        const errors = validate(values, schema);
        newState.errors = errors || {};
        console.log(errors);
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
    onSubmit = async (edit) => {
        if (edit) {
            this.setState({ edit: !edit });
        } else {
            const {
                name,
                mobileno,
                email,
                alternateNo,
                gst,
                companyName,
                address
            } = this.state.values;
            axios.post(`${apiUrl}api/profileUpdate`, { userId: userData.id, name, mobileno, email, alternateNo, gst, companyName, address }).then(res => {
                alert('data saved');
                const { name, mobileno, email, alternateNo, gst, companyName, address } = res.data.data;
                this.setState({ values: { name, mobileno, email, alternateNo, gst, companyName, address } });
            })
            // var response = await postData('api/profileUpdate', data);
        }
    }

    componentDidMount() {
        axios.post(`${apiUrl}api/getUserByNo`, { mobileno: userData.mobileno }).then(res => {
            const { name, mobileno, email, alternateNo, gst, companyName, address } = res.data;
            this.setState({ values: { name, mobileno, email, alternateNo, gst, companyName, address } });
            this.setState(this.state.values, this.validateForm);
        })
    }

    render() {
        const { classes } = this.props;
        const { values, touched, errors, isValid, edit } = this.state;
        const showEmailError = touched.email && errors.email;
        const showMobileError = touched.mobileno && errors.mobileno;
        const showNameError = touched.name && errors.name;
        const showAlternateNo = touched.alternateNo && errors.alternateNo;
        //     const showActivationDate = touched.date && errors.date;
        //     const showRenewalDate = touched.renewalDate && errors.renewalDate;
        //     const style={
        //         color: "#0060B6",
        //         textDecoration:"none",
        //       }
        // const date = new Date();
        // const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth();
        // const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        if (this.state.isLoading) return <div className={classes.progressWrapper}>
            <CircularProgress />
        </div>
        return (
            <DashboardLayout title="PROFILE">
                <Grid className={classes.content} item lg={7} xs={12} >
                    <div className={classes.content}>
                        <form className={classes.form}>
                            <div className={classes.fields}>
                                <TextfieldC type='number' defaultValue={values.mobileno} label='MOBILE NUMBER' edit={edit} onChange={e =>
                                    this.handleFieldChange('mobileno', e.target.value)
                                } /> {showMobileError && (
                                    <Typography
                                        className={classes.fieldError}
                                        variant="body2"
                                    >
                                        {errors.mobileno[0]}
                                    </Typography>
                                )}
                                <TextfieldC defaultValue={values.name} type='text' label='NAME' edit={edit} onChange={e =>
                                    this.handleFieldChange('name', e.target.value)
                                } />{showNameError && (
                                    <Typography
                                        className={classes.fieldError}
                                        variant="body2"
                                    >
                                        {errors.name[0]}
                                    </Typography>
                                )}

                                <TextfieldC defaultValue={values.email} type='email' label='EMAIL ADDRESS' edit={edit} onChange={e =>
                                    this.handleFieldChange('email', e.target.value)
                                } />
                                {showEmailError && (
                                    <Typography
                                        className={classes.fieldError}
                                        variant="body2"
                                    >
                                        {errors.email[0]}
                                    </Typography>
                                )}
                                <TextfieldC type='number' defaultValue={values.alternateNo} label='ALTERNATE NUMBER' edit={edit} onChange={e =>
                                    this.handleFieldChange('alternateNo', e.target.value)
                                } />{showAlternateNo && (
                                    <Typography
                                        className={classes.fieldError}
                                        variant="body2"
                                    >
                                        {errors.alternateNo[0]}
                                    </Typography>
                                )}
                                <TextfieldC defaultValue={values.gst} type='text' label='GST NO' edit={edit} onChange={e =>
                                    this.handleFieldChange('gst', e.target.value)
                                } />
                                <TextfieldC defaultValue={values.companyName} type='text' label='Company Name' edit={edit} onChange={e =>
                                    this.handleFieldChange('companyName', e.target.value)
                                } />
                                <TextField
                                    // InputLabelProps={{ style: { color: 'black' } }}
                                    // InputProps={{ style: { color: '#66788A' } }}
                                    className={classes.textField}
                                    multiline={true}
                                    rows={6}
                                    rowsMax={8}
                                    style={{ marginTop: 16 }}
                                    label="COMPANY ADDRESS"
                                    name="Company Address"
                                    onChange={e =>
                                        this.handleFieldChange('address', e.target.value)
                                    }
                                    type="text"
                                    value={values.address}
                                    variant="outlined"

                                    disabled={edit ? true : false}
                                />
                                {/* <input  className={classes.input} defaultValue={values.date}  label='ACTIVATION DATE'  type="date" min={`${date.getFullYear()}-${month}-${day}`}  edit={edit} onChange={e =>
                                        this.handleFieldChange('date', e.target.value)
                                    }  />
                                 
                                    {showActivationDate && (
                                        <Typography
                                            className={classes.fieldError}
                                            variant="body2"
                                        >
                                            {errors.date[0]}
                                        </Typography>
                                    )} */}
                                {/* <input className={classes.input} defaultValue={values.renewelDate}  label='RENEWAL DATE' type="date"  min={`${date.getFullYear()}-${month}-${day}`} edit={edit} onChange={e =>
                                        this.handleFieldChange('renewalDate', e.target.value)
                                    }  />{showRenewalDate && (
                                        <Typography
                                            className={classes.fieldError}
                                            variant="body2"
                                        >
                                            {errors.renewalDate[0]}
                                        </Typography>
                                    )} */}
                                {/* <Link to={!edit ? './UploadPhoto':'#'} style={style}>
                            <Container style={{display:'inline'}}>
                                <Box display='flex' p={2} justifyContent='space-between' className={[classes.boxMargin,classes.textField]} border={1}>
                                    UPLOAD PHOTO
                                    <Icon>
                                    keyboard_arrow_right
                                    </Icon>
                                </Box>
                            </Container>
                            </Link> */}
                            </div>
                        </form>
                    </div>
                </Grid>
                <button style={{ zIndex: 2 }} disabled={edit ? false : !isValid} style={{ backgroundColor: !edit ? !isValid ? '#DFE3E8' : '#0767DB' : null, borderRight: '1px solid #DFE3E8' }} className={classes.saveButton} value={edit} onClick={() => this.onSubmit(edit)} >{edit ? 'EDIT' : 'SAVE'}</button>
            </DashboardLayout>
        )
    }
}

export default withStyles(styles)(Profile);