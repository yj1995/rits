var mongoose = require('mongoose');
var Followup = require('./../models/followup.m');
var User = require('./../models/user.m');
var Mail = require('./../models/mail.m');
var schedule = require('node-schedule');
var smsGateway = require("../configs/smsGateway.js")
const cron = require("node-cron");
var async = require('async');

function find_followups() { //"followTime":new Date()




    var query = {
        isNotified: null

    }
    Followup.find(query).exec((err, data) => {
        if (err) {
            res.send({
                status: 0,
                message: 'Mongo error',
                data: err
            })

        } else {
            async.forEach(data, function (item, callback1) {
                send_message(item, function () {
                    callback1();

                });


            }, function (err, fin_call) {
                if (err) console.log(err);
                else {
                    console.log("evry night followup rotation done")


                }
            })

        }
    })

}
//find_followups();
cron.schedule("0 * * * *", function () {
    console.log("running a task every night", new Date());
    find_followups();
});
exports.get = (req, res, next) => {
    console.log(req.body, 'body')
    let query = {
        leadId: req.body.leadId
    }
    Followup.find(query).sort('-followTime').exec((err, data) => {
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
    // smsGateway.send('8500071153', "hello", function (err, resp) {
    //     if (err) console.log(err);
    //     else {
    //         res.send("success")
    //     }
    // });


    const newFollow = new Followup({
        userId: req.body.userId,
        comment: req.body.comment,
        leadId: req.body.leadId,
        followTime: req.body.followTime
    });
    //	console.log(req.body,"REQ DATA FROM FRONTENDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
    newFollow.save().then(data => {
        // var date = new Date(2019, 08, 21, 3, 31, 0);
        // let date = new Date(new Date().getTime() + 5000);
        var date = new Date(req.body.followTime)
        var x = "Please follow up with mamatha 8500071153";
        User.findOne({ _id: req.body.userId }).exec((err, userData) => {
            let userPhone = userData ? userData.mobileno : '8500071153'
            Mail.findOne({ _id: req.body.leadId }).exec((err, leadData) => {
                let leadName = leadData ? leadData.name : "mamatha";
                let leadNumber = leadData ? leadData.mobileno : "8500071153";
                let phone = userPhone
                //                let message =  `Please follow up with  ${leadName}  ${leadNumber}`
                let message = `Follow Up reminder : Please call  ${leadName} on ${leadNumber} now and dont forget to ask the customer for next call or meeting`
                var j = schedule.scheduleJob(date, function (y) {


                    smsGateway.send(phone, y, function (err, resp) {

                        if (err) console.log(err);
                        else {
                            console.log(y, "::::::::::::::::::::::::::");
                            let query = { leadId: req.body.leadId }

                            Followup.findOneAndUpdate({ userId: req.body.userId }, { notified_sms: true }, { new: true }).exec((err, data) => {
                                if (err) { console.log(err, 'err while updating notify') }
                                else { console.log('updatedddddddddddddddddddd') }
                            })
                        }
                    });

                    // update followup with notfiied true
                }.bind(null, message));
                res.send({ status: 1, message: 'inserted', data: data })
            })

        });


    })

};

function send_message(data, callback_sms) {
//    var x = "Please follow up with rohit 9353739482";

    User.findOne({
        _id: data.userId
    }).exec((err, userData) => {
        let userPhone = userData ? userData.mobileno : '9353739482'
        Mail.findOne({
            _id: data.leadId
        }).exec((err, leadData) => {
            let leadName = leadData ? leadData.name : "rohit";
            let leadNumber = leadData ? leadData.mobileno : "9353739482";
            let phone = userPhone;
            let date = data.followTime;
               let message= `Follow Up reminder : Please call  ${leadName} on ${leadNumber} now and dont forget to ask the customer for next call or meeting`

            console.log(date, phone, message, ":::::::::::::::::::", data);
            var d1 = new Date(date);
            var d2 = new Date();
            // true
            if (d1 < d2) date = d2;
            console.log(d1 < d2, d2)
            if (d1 < d2) {
                sms_gate_way_func();
            } else {
                var j = schedule.scheduleJob(d1 < d2 ? date : new Date(), function (y) {

                    sms_gate_way_func(y);

                }.bind(null, message));
            }

            function sms_gate_way_func(message) {
                smsGateway.send(phone, message, function (err, resp) {
                    if (err) console.log(err);
                    else {
                        Followup.findOneAndUpdate({
                            _id: data._id
                        }, {
                                isNotified: true
                            }, {
                                new: true
                            }).exec((err, data) => {
                                if (err) {
                                    console.log(err);
                                    res.send({
                                        err: "Please try again later"
                                    })

                            } else {
                                console.log(message, "status updated successfully...");
                                }
                            })
                    }
                });
            }
            callback_sms();
        })


    })
}
