var Request = require("request");
var mongoose = require('mongoose');

// models
var User = require('./../models/user.m');
var perpage=50;
exports.get = (req, res, next) => {
    console.log('here',req.body);
//
    if(!req.body.pageno)req.body.pageno=1;
    var skiprec=((req.body.pageno-1)*perpage);
    var limitrec=perpage;

	let query = {$and:[{active:null},{$or:[{_id:req.body.UserId},{createdUserId:req.body.UserId}]}]};
	User.find(query).skip(skiprec).limit(limitrec).exec((err, data)=>{if(err){
        res.send({status:0, message:'Failed', data:err})  
    }else{ 
        data.length ?
        res.send({status:1, message:'Success', data:data}) :   
        res.send({status:0, message:'No data found', data:""})    
	}})
};
exports.add = (req, res, next) => {
         if( req.body.typeofUser=="SubUser"){
                    req.body.roles.push('Pipeline')
                }
        const newUser= new User({
           name: req.body.name,
           	email: req.body.email,
           	mobileno: req.body.mobileno,
               ftoken : req.body.ftoken,
               gtoken : req.body.qtoken,
               nextPageToken :req.body.nextPageToken,
               typeofUser:req.body.typeofUser,
               createdUserId:req.body.createdUserId,
               roles:req.body.roles

        });
        if( req.body.typeofUser=="SubUser"){
            newUser["isApproved"]=true;
        }

        newUser.save().then(data => {
                res.send({data:"user added with roles successfully"});
        });
};
exports.getByNumber = (req, res, next) => {
//    console.log(req.query,'req.body')
////     let key = req.query.params,
////     value = req.body.value,
////     query = {key:value}
////
console.log(req.body);
     User.findOne({"mobileno" : req.body.mobileno}).exec((err, data)=>{if(!err){res.send(data)
     }else{ res.send(err) }})
};

exports.update = (req, res, next) => {
    let query = { _id : req.body.userId}
    let set = {
        isApproved : req.body.isApproved ? true : false
    } 

    User.findOneAndUpdate(query, set, {new:true}).exec((err, data)=>{if(!err){
        data ?
        res.send({status:1, message:'Success', data:data}) :   
        res.send({status:0, message:'No data found', data:""})

    }else{ res.send({status:0, message:'failed', data:err}) }})
};
exports.AlternativeEmailsUpdate = (req, res, next) => {
    let query = { _id : req.body.userId}

    User.findOneAndUpdate(query,  { $addToSet: { ForwardEmails:  req.body.email } }, {new:true}).exec((err, data)=>{if(!err){
        data ?
        res.send({status:1, message:'Success', data:data}) :
        res.send({status:0, message:'No data found', data:""})

    }else{ res.send({status:0, message:'failed', data:err}) }})
};
exports.profileUpdate = (req, res, next) => {   
    console.log(req.body);
    let query = { _id : req.body.userId};
     let set = {
        }
    if(req.body.mobileno)set["mobileno"]=req.body.mobileno;
    if(req.body.name)set["name"]=req.body.name;
    if(req.body.email)set["email"]=req.body.email;
    if(req.body.gst)set["gst"]=req.body.gst;
    if(req.body.companyName)set["companyName"]=req.body.companyName;
    if(req.body.address)set["address"]=req.body.address;
    if(req.body.alternateNo)set["alternateNo"]=req.body.alternateNo;


    User.findOneAndUpdate(query, set, {new:true}).exec((err, data)=>{if(!err){
        data ?
        res.send({status:1, message:'Profile updated successfully', data:data}) :
        res.send({status:0, message:'No user found', data:""})

    }else{ res.send({status:0, message:'failed', data:err}) }})
};
exports.del = (req, res, next) => {
    let query = { _id : req.body.userId}
    let set = {
        active : false
    } 

    User.findOneAndUpdate(query, set, {new:true}).exec((err, data)=>{if(!err){
        data ?
        res.send({status:1, message:'Success', data:data}) :   
        res.send({status:0, message:'No data found', data:""})

    }else{ res.send({status:0, message:'failed', data:err}) }})
};


