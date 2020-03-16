import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
// import googleapis from 'googleapis';


// Externals
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import validate from 'validate.js';
import _ from 'underscore';

// Material helpers
import { withStyles } from '@material-ui/core';

import { Facebook as FacebookIcon, Google as GoogleIcon } from 'icons'; 	// Shared components
import Modalframe from '../../components/Modalframe/Modalframe.jsx'; 	// Shared components


// Material components
import {
	Button,
	Checkbox,
	CircularProgress,
	Grid,
	IconButton,
	TextField,
	Typography
} from '@material-ui/core';

// Material icons
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

// Shared utilities
import validators from 'common/validators';

// Component styles
import styles from './styles';

// Form validation schema
import schema from './schema';

import { apiUrl } from "../../config";
// var config = require('../../config.json')
console.log(apiUrl, 'apiurl')

validate.validators.checked = validators.checked;

// Service methods
const signUp = () => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(true);
		}, 1500);
	});
};

class SignUp extends Component {
	state = {
		values: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			policy: false
		},
		touched: {
			firstName: false,
			lastName: false,
			email: false,
			password: false,
			policy: null
		},
		errors: {
			firstName: null,
			lastName: null,
			email: null,
			password: null,
			policy: null
		},
		isValid: false,
		isLoading: false,
		submitError: null,
		showModal: false,
		authUrl:'',
		isAuthorized:0
	
		};
	componentDidMount(){

		if(localStorage.getItem('isAuthorized')){
			this.setState({isAuthorized : localStorage.getItem('isAuthorized') == 2 ? localStorage.getItem('isAuthorized') : 0 })
		}
	}

	componentWillMount(){

      console.log(detectmob(), 'detectmob')
      this.setState({isPhone : detectmob()})
      function detectmob() {
        if( navigator.userAgent.match(/Android/i)
             || navigator.userAgent.match(/webOS/i)
             || navigator.userAgent.match(/iPhone/i)
             || navigator.userAgent.match(/iPad/i)
             || navigator.userAgent.match(/iPod/i)
             || navigator.userAgent.match(/BlackBerry/i)
             || navigator.userAgent.match(/Windows Phone/i)
             ){
            return true;
          }else {
            return false;
          }
      }
  }

	handleBack = () => {
		const { history } = this.props;

		history.push('/dashboard');
	
		};

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

	handleSignUp = async () => {
		try {
			const { history } = this.props;
			const { values } = this.state;

			this.setState({ isLoading: true });

			let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {}
			
			if(userData.mobileno){
    			this.setState({ isLoading : true })
				if(this.state.isAuthorized == 0){
					this.authorize(userData.mobileno)
				}else if(this.state.isAuthorized == 1){
					this.getToken(values.mobile, userData.mobileno)
				}else if(this.state.isAuthorized == 2){
					console.log('erer')
					this.state.isPhone ? history.push('/products') : history.push('/users');
				}
			}else{
				history.push('/sign-in');
			}

		} catch (error) {
			this.setState({
				isLoading: false,
				serviceError: error
			});
		}
	
		};

	handleSignUpOne = () => {

		// Client ID and API key from the Developer Console
		var CLIENT_ID = '214056703540-clckkr647ob4ckgpepuicpoemt8kdsah.apps.googleusercontent.com';
		var API_KEY = 'AIzaSyBeGqDYJ00qUBglVTwGk7Tu9HRDPMAlf7I';

		// Array of API discovery doc URLs for APIs used by the quickstart
		var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

		// Authorization scopes required by the API; multiple scopes can be
		// included, separated by spaces.
		var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

		var authorizeButton = document.getElementById('authorize_button');
		var signoutButton = document.getElementById('signout_button');

        window.gapi.load('client:auth2', () => {
        	console.log(window.gapi, 'window.gapi0')
			window.gapi.client.init({
		        apiKey: API_KEY,
	          	clientId: CLIENT_ID,
	          	discoveryDocs: DISCOVERY_DOCS,
	          	scope: SCOPES
	        }).then(function () {
	        	window.gapi.auth2.getAuthInstance().signIn();
        	});
        })

			// function abc(callback){ 
			// 	window.gapi.load('client:auth2')  
			// 	callback(c) 
			// } 
	  //     	abc(b, (c) => { 
	  //            console.log(c, 'b') 
	  //    	}) 

        function initClient(){

			window.gapi.client.init({
		          apiKey: API_KEY,
	          clientId: CLIENT_ID,
	          discoveryDocs: DISCOVERY_DOCS,
	          scope: SCOPES
	        }).then(function () {
	        	window.gapi.auth2.getAuthInstance().signIn();

	          // Listen for sign-in state changes.
	          // gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

	          // Handle the initial sign-in state.
	          // updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
	          // authorizeButton.onclick = handleAuthClick;
	          // signoutButton.onclick = handleSignoutClick;
	        }, function(error) {
	          // appendPre(JSON.stringify(error, null, 2));
	        });
        }

		// try {
		// 	this.setState({ isLoading: true });

		// 	let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {}
			
		// 	if(userData.mobileno){
  //   			this.setState({ isLoading : true })
		// 		if(this.state.isAuthorized == 0){
		// 			this.authorize(userData.mobileno)
		// 		}else if(this.state.isAuthorized == 1){
		// 			this.getToken(values.mobile, userData.mobileno)
		// 		}else if(this.state.isAuthorized == 2){
		// 			console.log('erer')
		// 			this.state.isPhone ? history.push('/products') : history.push('/users');
		// 		}
		// 	}else{
		// 		history.push('/sign-in');
		// 	}

		// } catch (error) {
		// 	this.setState({
		// 		isLoading: false,
		// 		serviceError: error
		// 	});
		// }
	
		};
	authorize(mobileno){
		axios.post(`${apiUrl}api/authorize`, { mobileno: mobileno }).then(res => {
        	console.log(res.data);
    		this.setState({ isLoading : false })
        	if(res.data.status == 2){
        		// this.setState({ showModal: true })
        		// this.setState({ authUrl : res.data.data })
        		this.setState({ isAuthorized : 1 })
        		localStorage.setItem('isAuthorized',1)

        		poptastic(res.data.data)
            	function poptastic(url) {
					var newWindow = window.open(url, 'name', 'height=600,width=450');
					if (window.focus) {
						newWindow.focus();
					}
			    }
        	}else if(res.data.status == 1){
				// show err message
				localStorage.setItem('userData', JSON.stringify(res.data.data.user))
        	}
     	})	
	
		}

	getToken(code, mobileno){
		axios.post(`${apiUrl}api/getToken`, { mobileno: mobileno, code:code }).then(res => {
        	console.log(res.data);
    		this.setState({ isLoading : false })
        	if(res.data.status == 1){
				this.setState({ isAuthorized : 2 })	
        		localStorage.setItem('isAuthorized',2)
				localStorage.setItem('userData', JSON.stringify(res.data.data.user))

        	}else {
				// show err message
        	}
     	})	
	}

	render() {
		const { classes } = this.props;
		const {
			values,
			touched,
			errors,
			isValid,
			submitError,
			isLoading,
			showModal,
			authUrl,
			isAuthorized
		} = this.state;

		const showFirstNameError =
			touched.firstName && errors.firstName ? errors.firstName[0] : false;
		const showLastNameError =
			touched.lastName && errors.lastName ? errors.lastName[0] : false;
		const showEmailError =
			touched.email && errors.email ? errors.email[0] : false;
		const showPasswordError =
			touched.password && errors.password ? errors.password[0] : false;
		const showPolicyError =
			touched.policy && errors.policy ? errors.policy[0] : false;

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
					<Grid
						className={classes.content}
						item
						lg={7}
						xs={12}
					>
						<div className={classes.content}>
							<div className={classes.contentHeader}>
								{/*<IconButton
									className={classes.backButton}
									onClick={this.handleBack}
								>
									<ArrowBackIcon />
								</IconButton>*/}
							</div>
							<div className={classes.contentBody}>
								<form className={classes.form}>
									<Typography className={classes.title} variant="h2" >
										Manage Email Leads
									</Typography>
										
									{isAuthorized == 1 || isAuthorized == 2 ? (
										<span>
											{isAuthorized == 1 ?(
												<div className={classes.fields}>
						                            <TextField
						                                className={classes.textField}
						                                label="Enter Google Code Here"
						                                name="Code"
						                                onChange={event => this.handleFieldChange('mobile', event.target.value) }
						                            	type="text"
						                            	value={values.mobile}
						                            	variant="outlined"
						                            	maxLength="10"
						                            />
													<Button
														className={classes.signUpButton}
														color="primary"
														onClick={this.handleSignUp}
														size="large"
														variant="contained"
													>
														Veirfy Code
													</Button>
						                        </div>
											) : (
												<span>
													<Typography className={classes.subtitle} variant="body1" >
							                            Gmail Configured Successfully
							                        </Typography>
	        										<Button
														className={classes.signUpButton}
														color="primary"
														onClick={this.handleSignUp}
														size="large"
														variant="contained"
													>
														Checkout Leads
													</Button>
												</span>
											)}
										</span>
									) : (
										<Button
											className={classes.signUpButton}
											color="primary"
											onClick={this.handleSignUp}
											size="large"
											variant="contained"
										>
											{/*onClick={this.handleSignUp}*/}
											Configure Gmail
										</Button>
									)}

									{isLoading ? (
			                        	<CircularProgress className={classes.progress} />
									) : (
										""
									)}

									{showModal ?
										<Modalframe url={authUrl ? authUrl : 'www.google.com'} />
										: ""
									}

								</form>
							</div>
						</div>
					</Grid>
				</Grid>
			</div>
		);
	}
}

SignUp.propTypes = {
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

export default compose(
	withRouter,
	withStyles(styles)
)(SignUp);
