'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FunctionSchema = new Schema({
	functionName: { type: String },
	userId: { type: String }
	
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toObject: { virtuals: true }, toJSON: { virtuals: true } });

module.exports = mongoose.model('Function', FunctionSchema);

