'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mailSchema = new Schema({
	userId: String,
	messageId: String,
	snippet: String,
	body: String,

	name: String,
	mobileno: String,
	alternateMobile: String,
	email: String,
	address: String,
	requirement: String,
	requiredDate: Date,
	searchDate: Date,
	area: String,
	city: String,
	state: String,
	status: String,
	assignedUser: String,
	assignedUserName: String,
	companyName: String,
	source: String,
	deal: Number,
	status: String,
	isEnquiry: { type: Boolean, default: false },
	quoted: { type: Boolean, default: false },
	isAdded: { type: Boolean, default: false }

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toObject: { virtuals: true }, toJSON: { virtuals: true } });

module.exports = mongoose.model('Mail', mailSchema);

