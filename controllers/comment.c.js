var mongoose = require('mongoose');
var Comment = require('./../models/comment.m');



exports.addComment = (req, res, next) => {

        const newComment= new Comment({
              userId:req.body.userId,
                taskId :req.body.taskId,
                comment:req.body.task
        })
        newComment.save().then(data => {
                res.send({data:"comment saved successfully"});
        });
};

//add tagssssssssssssssssssssssssssssssssss


