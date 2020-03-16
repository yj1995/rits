var mongoose = require('mongoose');

// models
var Quotation = require('./../models/quotations.m');



exports.send = (req, res, next) => {
    const newQuotation = new Quotation({
        functionId :req.body.functionId, 
        packageId : req.body.packageId, 
        userId:req.body.userId,
        leadId: req.body.leadId
    })
    newQuotation.save().then(data => {
        res.send( { status : 1, message: "Quote sent successfully" , data:data })

    })
};
exports.get = (req, res, next) => {
    let query = { userId: req.body.userId }
    let page = 1, limit = 20, skip = 0
    if (req.body.page > 1) {
        page = parseInt(req.body.page)
    }
    skip = limit * (page - 1)
    Quotation.find(query).sort('-updated_at').limit(limit).skip(skip).exec((err, data) => {
        if (!err) {
            res.send({ status : 1, message: "Quote data load", data: data })
        } else {
            res.send({ status: 0, message: 'Failed', data: err })
        }
    })
};




