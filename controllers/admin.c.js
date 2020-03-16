var mongoose = require('mongoose');
var Admin = require('./../models/admin.m');

exports.login = (req, res, next) => {
    let query = {email : req.body.email, password: req.body.password}
    
    Admin.findOne(query).exec((err, data)=>{if(!err){
    	data ?
        res.send({status:1, message:'Success', data:data}) : 
        res.send({status:0, message:'Failed', data:""})  
    }else{ 
        res.send({status:0, message:'Failed', data:err})
    }})
};

exports.add = (req, res, next) => {
    let query = {email : req.body.email, password: req.body.password, mobileno:req.body.mobileno, name:req.body.name}
    
    // Admin.findOne(query).exec((err, data)=>{if(!err){
    //     res.send({status:1, message:'Success', data:data})
    // }else{ 
    //     res.send({status:0, message:'Failed', data:err})
    // }})
};


