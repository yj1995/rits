import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from "../../../config";

// Externals
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import validate from 'validate.js';
import _ from 'underscore';

import { withStyles } from '@material-ui/core';						// Material helpers

import {															// Material components
	Grid,
	Button,
	IconButton,
	CircularProgress,
	TextField,
	Typography
} from '@material-ui/core';

import { ArrowBack as ArrowBackIcon } from '@material-ui/icons'; 			// Material icons
import { Facebook as FacebookIcon, Google as GoogleIcon } from 'icons'; 	// Shared components
import styles from './styles';
import schema from './schema';												// Form validation schema
import Logo from '../../../assets/images/Logo.jpg'; //img logo
const signIn = () => {														// Service methods
	return new Promise(resolve => {
		// setTimeout(() => {
		// 	resolve(true);
		// }, 1500);

	});

	};

class SignUpUI extends Component {
	state = {
		values: {
			email: '',
			password: '',
			mobile:'',
			otp:''
		},
		touched: {
			email: false,
			password: false,
			mobile: false,
			otp: false
		},
		errors: {
			email: null,
			password: null,
			mobile: null,
			otp: null
		},
		isValid: false,
		isLoading: false,
		isOtp: false,
		submitError: null,
		isApproved: true

		};

	componentWillMount(){
		const { history } = this.props;
		if(localStorage.getItem('isAuthenticated') == 1){
			history.push('/dashboard')
		}
		// localStorage.clear();
		}

	handleBack = () => {
		const { history } = this.props;
		history.goBack();
	
		};

	validateForm = _.debounce(() => {
		const { values } = this.state;

		const newState = { ...this.state };
		const errors = validate(values, schema);
		console.log(errors, 'login ')
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

	handleSignIn = async () => {
		try {
			const { history } = this.props;
			const { values } = this.state;
			console.log(values.otp, 'values')

			this.setState({ isLoading: true });

			if(this.state.isOtp == true){
				axios.post(`${apiUrl}api/verifyOtp`, { mobileno: values.mobile,otp:values.otp }).then(res => {
		        	console.log(res.data);
	        		this.setState({ isLoading : false })
		        	if(res.data.status == 1){
		        		if(res.data.data.isApproved){
		        			this.setState({ notify : false })
							localStorage.setItem('userData', JSON.stringify(res.data.data));
							localStorage.setItem('isAuthenticated', 1);
							if(res.data.data.gtoken){
								localStorage.setItem('isAuthorized', 2);
								history.push('/dashboard');		        		
							}else{
								// history.push('/sign-up');		        		
								history.push('/dashboard');		        		
							}
		        		}else{
		        			this.setState({ isApproved : false })
		        		}
		        	}else{
						// show err message
		        	}
		     	})				
			}else{
				axios.post(`${apiUrl}api/sendOtp`, { mobileno: values.mobile }).then(res => {
		        	console.log(res.data);
	        		this.setState({ isLoading : false })
		        	if(res.data.status == 1){
		        		this.setState({ isOtp : true })
		        	}else{
						// show err message
		        	}
		     	})
			}
		} catch (error) {
			this.setState({ isLoading: false, serviceError: error });
		}
	
		};


	render() {
		const { classes } = this.props;
		const {
			values,
			touched,
			errors,
			isValid,
			submitError,
			isLoading,
			isOtp
		} = this.state;

		const showEmailError = touched.email && errors.email;
		const showMobileError = touched.mobile && errors.mobile;
		const showOtpError = touched.otp && errors.otp;
		const showPasswordError = touched.password && errors.password;

	return (
			<div className={classes.root}>
			    <Grid className={classes.grid} container >
			        <Grid className={classes.quoteWrapper} item lg={5} >
			            <div className={classes.quote}>
			                <div className={classes.quoteInner}>
			                    <Typography className={classes.quoteText} variant="h1" >
			                        {/*Hella narwhal Cosby sweater McSweeney's, salvia kitsch before
			                        they sold out High Life.*/}
			                    </Typography>
			                    <div className={classes.person}>
			                        <Typography className={classes.name} variant="body1" >
			                            {/*Takamaru Ayako*/}
			                        </Typography>
			                        <Typography className={classes.bio} variant="body2" >
			                            {/*Manager at inVision*/}
			                        </Typography>
			                    </div>
			                </div>
			            </div>
			        </Grid>
			        <Grid className={classes.content} item lg={7} xs={12} >
			            <div className={classes.content}>
			                <div className={classes.contentHeader}>
			                    <IconButton className={classes.backButton} onClick={this.handleBack} >
			                        <ArrowBackIcon />
			                    </IconButton>
			                </div>
			                <div className={classes.contentBody}>
			                    <form className={classes.form}>
								<div style={{textAlign:'center'}}>
										<img style={{width: '100px', height: '100px'}} src={Logo} alt='Logo' />
									<Typography
										className={classes.title}
										variant="h2"
										style={{fontFamily: 'Lato',
										fontWeight:" 600"}}
									>
										SIGN-UP
									</Typography>
									</div>

			                        <div className={classes.fields}>
			                            <TextField
			                                className={classes.textField}
			                                label="Mobile Number"
			                                name="Mobile"
			                                onChange={event =>
			                            this.handleFieldChange('mobile', event.target.value)
			                            }
			                            type="text"
			                            value={values.mobile}
			                            variant="outlined"
			                            maxLength="10"
			                            />
			                            {showMobileError && (
			                            <Typography
			                                className={classes.fieldError}
			                                variant="body2"
			                                >
			                                {errors.mobile[0]}
			                            </Typography>
			                            )}
			                        </div>

			                        {isOtp ? (
			                        	<span>
				                        	<div className={classes.fields}>
					                            <TextField
					                                className={classes.textField}
					                                label="OTP"
					                                name="Otp"
					                                onChange={event =>
					                            this.handleFieldChange('otp', event.target.value)
					                            }
					                            type="text"
					                            value={values.otp}
					                            variant="outlined"
					                            />
					                            {showOtpError && (
					                            <Typography
					                                className={classes.fieldError}
					                                variant="body2"
					                                >
					                                {errors.otp[0]}
					                            </Typography>
					                            )}
					                        </div>
					                    </span>
			                        ) : (
			                        	""
			                        )}

			                        {isLoading ? (
			                        <CircularProgress className={classes.progress} />
			                        ) : (<div>
											<Button
												className={classes.signInButton}
												color="primary"
												disabled={!isValid}
												onClick={this.handleSignIn}
												size="large"
												variant="contained"
												style={{fontFamily: 'Lato',
										fontWeight:" 600"}}
												>
											CREATE ACCOUNT
											</Button>
											<div style={{textAlign:'center'}}>  
											<span style={styles.linkSignup}>By creating an account you agree with<br />our
											<Link  to={"/TermsOfUse"} style={styles.linkSignup}> Terms Of Use </Link>and  
											<Link  to={"/Privacy_Policy"} style={styles.linkSignup}> Privacy Policy</Link>
											</span>
											</div> 
											
									</div>
			                        )}

			                        {
			                        	!this.state.isApproved ?
			                        	<p style={{color:"green",padding:20, textAlign:"center"}}>Your account is being verified by the admin and you will be notified soon</p>
			                        	: ""
			                        }
			                        {/*<Typography
			                            className={classes.signUp}
			                            variant="body1"
			                            >
			                            Don't have an account?{' '}
			                            <Link
			                                className={classes.signUpUrl}
			                                to="/sign-up"
			                                >
			                            Sign up
			                            </Link>
			                        </Typography>*/}
			                    </form>
			                </div>
			            </div>
			        </Grid>
			    </Grid>
			</div>
		);
	}
}

SignUpUI.propTypes = {
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

export default compose(
	withRouter,
	withStyles(styles)
	)(SignUpUI);
