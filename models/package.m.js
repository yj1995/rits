'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var packageSchema = new Schema({

    functionId : { type: String }, 
    packageName : { type: String }, 
    packageDetails : { type: String }, 
    pdfUrl : { type: String }, 
    userId: { type: String },
    fileName:{type:String}
	
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toObject: { virtuals: true }, toJSON: { virtuals: true } });

module.exports = mongoose.model('Package', packageSchema);

