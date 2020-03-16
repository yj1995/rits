'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskManagementSchema = new Schema({

    priority : { type: String },
    assignUser:{type:Array},
    assignedBy:{type:String},
    taskTitle:{type:String},
    taskDesc:{type:String},
    startDateTime:{type:Date},
    endDateTime:{type:Date},
    tags:{type:String}

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toObject: { virtuals: true }, toJSON: { virtuals: true } });

module.exports = mongoose.model('TaskManagement', TaskManagementSchema);

