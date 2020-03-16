'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var otpSchema = new Schema({
	mobileno: {type: String, required: true, unique:true},
	otp:String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toObject: { virtuals: true }, toJSON: { virtuals: true } });

module.exports = mongoose.model('Otp', otpSchema);

