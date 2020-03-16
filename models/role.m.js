'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleSchema = new Schema({
	role:{type: String}
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toObject: { virtuals: true }, toJSON: { virtuals: true } });

module.exports = mongoose.model('Role', roleSchema);

