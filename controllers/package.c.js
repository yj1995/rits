var mongoose = require('mongoose');

// models
var Package = require('./../models/package.m');
var Function = require('./../models/function.m');

var async = require('async');
var multer = require('multer');
var multerS3 = require('multer-s3');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./configs/awsConfig.json');
var s3 = new AWS.S3();
var path = require('path');
var s3url = 'https://ritsworld.s3.amazonaws.com/'
// https://ritsworld.s3.amazonaws.com/Screenshot+from+2019-03-04+11-57-48.png
var bucket = "ritsworld";


//var params = {Bucket: 'bucket', Key: 'key', Body: stream};
//var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
//s3.upload(params, options, function(err, data) {
//  console.log(err, data);
//});


var storage = multerS3({
    s3: s3,
    bucket: bucket,
    metadata: function(req, file, cb) {
        cb(null, {
            fieldName: file.fieldname
        });
    },
    key: function(req, file, cb) {
        console.log(file, 'file')
        var newFileName = Date.now() + "-" + file.originalname;
        var fullPath = `${newFileName}`;
        cb(null, fullPath)
    }
})
exports.upload = function(req, res, cb) {
//
// fileFilter: function (req, file, cb) {
//            if (path.extension(file.originalname) !== '.pdf') {
//            console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",path.extension(file.originalname))
//              return cb(null, false)
//            }
//
//            cb(null, true)
//          }

    var upload = multer({
        storage: storage,
        limits: { fileSize:  20 * 1024 * 1024  }

    }).array('file', 2);




    upload(req, res, function(err) {
        if (err) {
            // An error occurred when uploading
                                    res.send({ status: 0, message : "File Size should be less than 2 MB and PDF only", err:err })

        } else {
//            if(!pdfext){
//
//                                    res.send({ status: 0, message : "File Size should be less than 2 MB and PDF only", data:"" })
//
//            }

              if (req.files && req.files.length > 0) {
                            var data = req.files.map((x) => {
                                let filename = `${s3url}${x.key}`
                                 var arr = filename.split(' ');
                                    var modifiedStr = arr.join('%20');

                                    return modifiedStr;
//                                return filename
                            })
                            console.log(data, 'data',req.files)
                            res.send({
                                status:1,
                                data: data,
                                fileName:req.files
                            });
                        } else {
                        res.send({ status: 0, message : 'image not received', data:"" })
                        }


        }
        // res.json(uploadedFileName);
    });
};

exports.add = (req, res, next) => {
    const newPackage = new Package({
        functionId: req.body.functionId,
        packageName: req.body.packageName,
        packageDetails: req.body.packageDetails,
        pdfUrl: req.body.pdfUrl,
        fileName:req.body.fileName,
        userId: req.body.userId
    })
    newPackage.save().then(data => {
        res.send({
            status: 1,
            message: "Package added successfully",
            data: data
        })
    })
};
exports.del = (req, res, next) => {

    Package.find({ _id:req.body.packageId}).remove().exec().then(data => {
        res.send({
            status: 1,
            message: "Package deleted successfully",
            data: data
        })
    })
};
exports.update = (req, res, next) => {
  Package.findOneAndUpdate({_id : req.body.packageId }, {pdfUrl:req.body.pdfUrl}, {new:true,upsert:true}).exec((err,data) => {
                                if(err) {console.log(err, 'err while updating notify')}
                                else{console.log('updatedddddddddddddddddddd',data);

                                 res.send({
                                            status: 1,
                                            message: "Package updated successfully",
                                            data: data
                                        })}
                            })

};
exports.get = (req, res, next) => {
let query = {
    userId: req.body.userId
}
let page = 1,
    limit = 20,
    skip = 0
if (req.body.page > 1) {
    page = parseInt(req.body.page)
}
skip = limit * (page - 1);


Package.find(query).sort('-updated_at').limit(limit).skip(skip).exec((err, data) => {
        if (!err) {

            var functions = [];var func_ids=[];
            async.each(data, function(eachrec, callb) {
                    Function.find({
                        _id: eachrec.functionId
                    }).sort('-updated_at').exec((err, data) => {
                        if (!err) {
                            if(func_ids.indexOf(data[0]._id)==-1 || func_ids.length==0){
                                functions.push(data[0]);func_ids.push(data[0]._id);
                            }

                            callb(null);
                        } else {
                            console.log("err", err);
                            callb(err);
                        }
                    });


        },
        function(err, final_cb) {
            if (err) console.log(err)
            else {
//                console.log(functions, data, "------------------------------------")
                res.send({
                    status: 1,
                    message: "Packages loaded",
                    data: {functions:functions,packages:data}
                })

            }
        })

}
else {
    res.send({
        status: 0,
        message: 'Failed',
        data: err
    })
}
})
};


