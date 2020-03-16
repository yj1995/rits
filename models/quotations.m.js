'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quotationsSchema = new Schema({

    userId: { type: String },
     leadId: { type: String },
      packageId: { type: String }, 
      functionId: { type: String }
	
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toObject: { virtuals: true }, toJSON: { virtuals: true } });

module.exports = mongoose.model('Quotation', quotationsSchema);

