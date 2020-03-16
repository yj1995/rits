import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';

import moment from 'moment';
import axios from 'axios';
import { apiUrl } from "../../../../config";

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Typography, Divider } from '@material-ui/core';

// Material icons
import {
	AccessTime as AccessTimeIcon,
	GetApp as GetAppIcon
} from '@material-ui/icons';

// Shared components
import { Paper } from 'components';

// Component styles
import styles from './styles';

class ProductCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: true,
		}
	}
	hype = (mobileno) => {
		// window.open(`tel:${mobileno}`);
		var dummy = document.createElement("textarea");
		dummy.value = mobileno;
		dummy.select();
		document.execCommand("copy");
	}
	followup(mobileno, email, lId, followup) {
		const { history } = this.props;
		console.log(followup, 'followup');
		followup = !followup ? [] : followup;
		var obj = { mobileno, email, lId, followup };
		localStorage.setItem('followup', JSON.stringify(obj));
		localStorage.setItem('followLeadId', lId);
		history.push('/follow-up-list');
	}

	sendQuote = (leadName, leadMobile, leadEmail, lId) => {
		let { history } = this.props;
		history.push(`/quote?leadId=${lId}`);
		// let userData = localStorage.getItem('userData'),
		// 	userId = userData ? JSON.parse(userData).id : '',
		// 	data = {
		// 		name: leadName,
		// 		mobileno: leadMobile,
		// 		email: leadEmail,
		// 		mailId: lId,
		// 		senderId: userId,
		// 	}
		// axios.post(`${apiUrl}api/sendQuote`, data).then(res => {
		// 	console.log(res.data);
		// 	// this.setState({ isLoading : false })
		// 	if (res.data.status === 1) {
		// 		window.alert('Quote sent successfully')
		// 		let quoteBtn = document.getElementById(`quoteBtn${lId}`)
		// 		quoteBtn.setAttribute('disabled', true)
		// 		quoteBtn.style.background = 'white';
		// 		quoteBtn.style.color = 'green';
		// 		quoteBtn.textContent = 'View Quote';
		// 	} else {
		// 		// show err message
		// 	}
		// })
	}

	toggle() {
		this.setState(prevState => ({
			modal: !prevState.modal
		}));
	}
	render() {
		const { classes, className, product } = this.props;
		const rootClassName = classNames(classes.root, className);
		return (
			<Paper className={rootClassName}>
				<Row style={{ margin: 0, marginTop: 5 }}>
					{product.isAdded ?
						<>
							<Col xs="2" style={{ paddingRight: 0, maxWidth: typeof window.orientation !== 'undefined' ? 60 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 60px" : null }}>Date: </Col>
							<Col xs="9" style={{ wordWrap: 'break-word', padding: 0 }}>{product.requiredDate ?
								moment(new Date(product.requiredDate)).format('DD/MM/YYYY hh:mm a') : ''
							}
							</Col></> :

						<>
							<Col xs="2" style={{ paddingRight: 0, maxWidth: typeof window.orientation !== 'undefined' ? 60 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 60px" : null }}>Date: </Col>
							<Col xs="9" style={{ wordWrap: 'break-word', padding: 0 }}>{product.requiredDate ?
								moment(new Date(new Date(product.requiredDate).setHours(new Date(product.requiredDate).getHours())).setMinutes(new Date(product.requiredDate).getMinutes())).format('DD/MM/YYYY hh:mm a') : ''
							}
							</Col></>
					}


				</Row>
				<Row style={{ margin: 0 }}>
					<Col xs="3" style={{ paddingRight: 0, maxWidth: typeof window.orientation !== 'undefined' ? 68 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 68px" : null }}>Name: </Col>
					<Col xs="8" style={{ wordWrap: 'break-word', padding: 0 }}>{product.name ? product.name : ''}</Col>
				</Row>

				{product.mobileno ?
					<Row style={{ margin: 0 }}>
						<Col xs="3" style={{ paddingRight: 0, maxWidth: typeof window.orientation !== 'undefined' ? 76 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 76px" : null }}>Mobile: </Col>
						<Col xs="8" style={{ wordWrap: 'break-word', padding: 0 }}>{product.mobileno}</Col>

					</Row>
					: ""}

				{product.email ?
					<Row style={{ margin: 0 }}>
						<Col xs="3" style={{ paddingRight: 0, maxWidth: typeof window.orientation !== 'undefined' ? 66 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 66px" : null }}>Email: </Col>
						<Col xs="8" style={{ wordWrap: 'break-word', padding: 0 }}>{product.email}</Col>
					</Row>
					: ""}
				<Row style={{ margin: 0 }}>
					<Col xs="3" style={{ paddingRight: 0, maxWidth: typeof window.orientation !== 'undefined' ? 77 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 77px" : null }}>Source: </Col><Col xs="8" style={{ wordWrap: 'break-word', padding: 0 }}>{product.source ? product.source : "JustDial"}</Col>
				</Row>
				{product.assignedUserName ?
					<Row style={{ paddingBottom: 5, margin: 0 }}>
						<Col xs="3" style={{ maxWidth: typeof window.orientation !== 'undefined' ? 113 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 113px" : null, paddingRight: 0 }}>Assigned To: </Col>
						<Col xs="7" style={{ wordWrap: 'break-word', padding: 0 }}>{product.assignedUserName}</Col>
					</Row> : ""}
				<Row style={{ paddingBottom: 5, margin: 0 }}>
					<Col xs="3" style={{ maxWidth: typeof window.orientation !== 'undefined' ? 120 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 120px" : null }}>Requirement: </Col>
					<Col xs="7" style={{ wordWrap: 'break-word', padding: 0 }}>{product.requirement}</Col>
				</Row>
				<Row style={{ margin: 0, borderTop: '1px solid #DFE3E8', height: 45, }}>
					{/* <Col xs="4" style={{ padding: 0, paddingLeft: 15 }}>
						{product.mobileno ?
							<Button onClick={() => { this.hype(product.mobileno) }} style={{ width: "95%" }} color="success">Call</Button> :
							<Button disabled style={{ width: "95%" }} color="success">Call</Button>
						}
					</Col> */}
					<Col xs="6" style={{ padding: 0, borderRight: "1px solid #DFE3E8" }}><Button className={classes.buttonStyle} id={"followup" + product.id}
						onClick={(e) => {
							e.stopPropagation();
							this.followup(product.mobileno, product.email, product._id, product.followup);
						}}>Follow Up</Button></Col>
					<Col xs="6" style={{ padding: 0 }}><Button className={classes.buttonStyle} id={"quoteBtn" + product.id}
						disabled={product.quoted} style={{ backgroundColor: product.quoted ? 'white' : null, color: product.quoted ? 'green' : null }}
						onClick={(e) => {
							e.stopPropagation();
							this.sendQuote(product.name, product.mobileno, product.email, product.id);
						}}>{product.quoted ? 'View Quote' : 'Send Quote'}</Button></Col>
				</Row>
			</Paper>

		);
	}
}

ProductCard.propTypes = {
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	product: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductCard);
