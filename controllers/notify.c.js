var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbconn;
var smsGateway = require("../configs/smsGateway.js")

var admin = require("firebase-admin");
var async = require('async');
var serviceAccount = require("../configs/notify.json");
var registrationToken = "eOiys1LkBjg:APA91bESs-87KYGou1KRqkuynFIt0sIu03NGWqorWAqw6V5_a39dbvzEXNIb-yqL_3Ho8lNfEbLBawzvqFvDn8WPcoXeC6DRhUgKUwNnS6Af_IumhUwPpSDBeoImrSnNwPS2fW_k_2g3";
var ObjectId = require('mongodb').ObjectID;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://grabscoin.firebaseio.com"

});
var Image = require('./../models/followup.m');

const EventEmitter = require('events');
class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();
function create_mongo_conn(callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        else {
            var dbo = db.db("mailito");

            dbconn = dbo;
            callback(dbconn);

        }

    });
}



function rotate_cron() {

    if (dbconn) {
        find_followups();
    } else {
        create_mongo_conn(function () {
            find_followups();
        })
    }
    function find_followups() {//"followTime":new Date()



        console.log(new Date(new Date().getTime() - 1000 * 60 * 1), new Date())

        // Image.findOne({userId:body.senderId}).exec((err,resy) => {if(!err){

        // }else{ 
        //     res.send({status:0, message:'db error', data:err})
        // }})

        dbconn.collection("followups").find({
            followTime: {
                $gte: new Date(new Date().getTime() - 1000 * 60 * 1)
            },
            $or: [{ notified: null }, { notified_sms: null }]
        }).toArray(function (err, result) {
            if (err) throw err;
            else {
                if (result.length) {
                    myEmitter.emit('getnotify', result);
                } else {


                    console.log("no data to notify.........................")
                }
            }
        });
    }




};

myEmitter.once('getnotify', (followups) => {

    // replace registration token with followups user token and message
    async.each(followups, function (oneUserFollowup, callback) {

        async_parallel(oneUserFollowup, function (err, respp) {
            if (err) console.log(err);
            else {
                callback();

            }
        })

    }, function (err, response) {
        if (err) console.log(err);
        else {
            console.log("notifier response::::::::::::", response)
        }
    });

    function async_parallel(oneUserFollowup, final_callback) {
        async.parallel({
            message: function (callback) {
                if (!oneUserFollowup.notified_sms) {
                    var followup_msg = "Please follow up with mamatha 8500071153"
                    smsGateway.send(8500071153, followup_msg, function (err, resp) {
                        if (err) console.log(err);
                        else {
                            dbconn.collection("followups").updateOne({ _id: ObjectId(oneUserFollowup._id) }, { $set: { notified_sms: true } }, function (err, result) {
                                if (err) throw err;
                                else {
                                    callback(null, resp);
                                }
                            });
                        }
                    });
                }
            },
            notification: function (callback) {
                if (!oneUserFollowup.notified_sms) {

                    call_fcm_notifier(oneUserFollowup, function (err, notifycallbackres) {
                        if (err) callback(err);
                        else callback(null, notifycallbackres);

                    })
                }
            }
        }, function (err, results) {
            if (err) {
                console.log(err);
                final_callback(err);

            }
            else {
                final_callback(null, results);
            }
        });
    }
    function call_fcm_notifier(followupdata, callback_fcm) {
        console.log(followupdata, "%%%%%%%%%%%%%%%%%%%%%%%%%%");


        var payload = {
            notification: {
                title: "followup notification",
                body: "notification from ritsworld-leads followup"
            }
        };

        var options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };


        admin.messaging().sendToDevice(registrationToken, payload, options)
            .then(function (response) {
                console.log("Successfully sent message:", response);
                dbconn.collection("followups").updateOne({ _id: ObjectId(followupdata._id) }, { $set: { notified: true } }, function (err, result) {
                    if (err) throw err;
                    else {
                        callback_fcm(null, response);
                    }
                });
            })
            .catch(function (error) {
                console.log("Error sending message:", error);
                callback_fcm(error);
            });
    }

})
// rotate_cron();
//
// const cron = require("node-cron");
// cron.schedule("0 24 * * *", function () {
//     console.log("running a task every minute", new Date());
//     rotate_cron();
// });







