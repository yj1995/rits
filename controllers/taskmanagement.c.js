var mongoose = require('mongoose');
var Task = require('./../models/taskmanagement.m');

exports.list = (req, res, next) => {
 var query , start ,end ;
    if(req.body.view =="listView"){
     start = new Date();
     start.setHours(0,0,0,0);

     end = new Date();
     end.setHours(23,59,59,999);
     query ={created_at: {$gte: start, $lt: end}};

    }else{
            start = new Date(req.body.calenderDate);
            //start.setHours(0,0,0,0);

            end = new Date();
            end.setHours(23,59,59,999);
            query ={created_at: {$gte: start, $lt: end}};
    }

    Task.find(query).sort('-updatedAt').exec((err, data) => {
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

exports.addTask = (req, res, next) => {

        const newTask= new Task({
                priority : req.body.priority,
                assignUser:req.body.assignUser,
                assignedBy:req.body.assignedBy,
                taskTitle:req.body.title,
                taskDesc:req.body.desc,
                startDateTime:req.body.startDateTime,
                endDateTime:req.body.endDateTime,
                tags:req.body.tags
        })
        newTask.save().then(data => {
                res.send({data:"task added successfully"});
        });
};

//add tagssssssssssssssssssssssssssssssssss


