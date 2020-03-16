'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String },
    email: { type: String },
    mobileno: { type: String, required: true, unique: true },
    alternateNo: { type: String },
    gst: { type: String },
    companyName: { type: String },
    address: { type: String },
    ftoken: { type: String },
    gtoken: { type: String },
    nextPageToken: { type: String },
    isApproved: { type: Boolean, default: false },
    typeofUser: { type: String },
    createdUserId: { type: String },
    roles: Array,
    active: String,
    ForwardEmails: { type: Array }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toObject: { virtuals: true }, toJSON: { virtuals: true } });

module.exports = mongoose.model('User', userSchema);

