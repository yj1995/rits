'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var followupSchema = new Schema({
	userId: { type: String },
	leadId: String,
	comment: String,
	followTime: Date,
	isNotified:Boolean
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toObject: { virtuals: true }, toJSON: { virtuals: true } });

module.exports = mongoose.model('Followup', followupSchema);

