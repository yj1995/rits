var mongoose = require('mongoose');
var Role = require('./../models/role.m');

exports.getRoles = (req, res, next) => {
//    let query = {_id : req.body.userId}

    Role.find({}).sort('-updatedAt').exec((err, data) => {
                 if (!err) {
                     data.length ?
                         res.send({
                             status: 1,
                             message: 'Success',
                             data: data
                         }) :
                         res.send({
                             status: 0,
                             message: 'No data',
                             data: ""
                         })
                 } else {
                     res.send({
                         status: 0,
                         message: 'Mongo error',
                         data: err
                     })
                 }
                 })

};

exports.add = (req, res, next) => {

        const newRole= new Role({
            role:req.body.role
        })
        newRole.save().then(data => {
                res.send({data:"Role added successfully"});
        });
};


