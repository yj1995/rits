'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mailDataSchema = new Schema({
	from:String,
	subject:String,
	body:String,
	snippet:String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toObject: { virtuals: true }, toJSON: { virtuals: true } });

module.exports = mongoose.model('MailData', mailDataSchema);

