var mongoose = require('mongoose');

// models
var Function = require('./../models/function.m');



exports.add = (req, res, next) => {
    const newFunction = new Function({
        functionName:req.body.functionName,
        userId:req.body.userId
    })
    newFunction.save().then(data => {
        res.send( { status : 1, message: "Function added successfully" , data:data })

    })
};
exports.del = (req, res, next) => {

    Function.find({ _id:req.body.functionId}).remove().exec().then(data => {
        res.send({
            status: 1,
            message: "Function deleted successfully",
            data: data
        })
    })
};
exports.get = (req, res, next) => {
    let query = { userId: req.body.userId }
    let page = 1, limit = 20, skip = 0
    if (req.body.page > 1) {
        page = parseInt(req.body.page)
    }
    skip = limit * (page - 1)
    Function.find(query).sort('-updated_at').limit(limit).skip(skip).exec((err, data) => {
        if (!err) {
            res.send({ status : 1, message: "Functions loaded", data: data })
        } else {
            res.send({ status: 0, message: 'Failed', data: err })
        }
    })
};





