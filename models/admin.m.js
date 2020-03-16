'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
	email: {type: String, required: true, unique:true},
	password: {type: String, required:true, unique:true},
	name: {type: String },
	mobileno: {type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toObject: { virtuals: true }, toJSON: { virtuals: true } });

module.exports = mongoose.model('Admin', adminSchema);

