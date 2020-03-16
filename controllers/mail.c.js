var mongoose = require('mongoose');

// models
var Mail = require('./../models/mail.m');
var MailData = require('./../models/mailData.m');

exports.getMailsBy = (req, res, next) => {
    console.log(req.body, ":::::::::::::::::::::::::::::::::::::::::::::::")
    let query = { [Object.keys(req.body)]: req.body[Object.keys(req.body)], status: req.body.status }
    //    console.log(query, 'req.body')
    //var s;
    //if(req.body.pageno){
    //    s=(parseInt(req.body.pageno)-1)*20;
    //}else{
    //s=0;
    //}.skip(s).limit(20)
    Mail.find(query).exec((err, data) => {
        if (!err) {
            //        console.log(data);
            res.send({ status: 1, message: 'Success', data: data })
        } else {
            res.send({ status: 0, message: 'Failed', data: err })
        }
    })
};

exports.addMailData = (req, res, next) => {
    console.log(req.body, "mail dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    const newMail = new Mail({
        userId: req.body.query.userId,
        assignedUser: req.body.query.assignedUser ? req.body.query.assignedUser : '',
        assignedUserName: req.body.query.assignedUserName ? req.body.query.assignedUserName : '',
        name: req.body.data.name,
        mobileno: req.body.data.mobileno,
        email: req.body.data.email,
        source: req.body.data.source,
        requirement: req.body.data.requirement,
        address: req.body.data.address,
        requiredDate: new Date(req.body.data.requiredDate),
        isAdded: req.body.data.isAdded ? true : false,
        deal: req.body.data.deal,
        status: req.body.data.status,
        companyName: req.body.data.companyName
    })
    newMail.save().then(data => {
        res.send({ status: 1, message: 'insert', data: data })
    })
};


exports.getMails = (req, res, next) => {
    var query;

    if (req.body.userId) {
        query = { userId: req.body.userId };
    } else if (req.body.assignedUser) {
        query = { assignedUser: req.body.assignedUser };
    }
    console.log(req.body, ":::::get mails", query);

    let page = 1, limit = 20, skip = 0;
    if (req.body.page > 1) {
        page = parseInt(req.body.page)
    }
    skip = limit * (page - 1)
    Mail.find(query).sort('-requiredDate').limit(limit).skip(skip).exec((err, data) => {
        if (!err) {
            //        console.log(data);
            res.send({ status: 1, message: 'Success', data: data })
        } else {

            res.send({ status: 0, message: 'Failed', data: err })
        }
    })
};
exports.updatestatus_lead = (req, res, next) => {
    console.log(req.body, 'bodyy')
    // hmjhmh
    Mail.findOneAndUpdate({ _id: req.body.id }, { status: req.body.status }, { new: true }).exec((err, data) => {
        if (err) {
            console.log(err);
            res.send({ err: "Please try again later" })

        }
        else {
            console.log(data, 'updatestatus');
            res.send({ data: "Successfully updated" })

        }
    })

};
exports.lead_Search_nd_Filter = (req, res, next) => {
    console.log(req.body, 'bodyy');
    var query;
    if (req.body.status) {
        if (req.body.assignedUser) query = { status: req.body.status, assignedUser: req.body.assignedUser };
        else query = { status: req.body.status, userId: req.body.userId };
    }
    else {
        if (req.body.assignedUser) query = { $and: [{ assignedUser: req.body.assignedUser }, { $or: [{ name: { $regex: req.body.searchkey, $options: 'i' } }, { mobileno: { $regex: req.body.searchkey, $options: 'i' } }, { email: { $regex: req.body.searchkey, $options: 'i' } }] }] };
        else query = { $and: [{ userId: req.body.userId }, { $or: [{ name: { $regex: req.body.searchkey, $options: 'i' } }, { mobileno: { $regex: req.body.searchkey, $options: 'i' } }, { email: { $regex: req.body.searchkey, $options: 'i' } }] }] };
    }
    Mail.find(query).exec((err, data) => {
        if (err) {
            console.log(err, 'err');
            res.send({ err: "Please try again later" })

        }
        else {
            // console.log(data, 'searched recordssssss');
            res.send({ data: data })
        }
    });
}

exports.assign = (req, res, next) => {
    let query = { _id: req.body.leadId }
    let set = {
        assignedUser: req.body.userId,
        assignedUserName: req.body.name
    }

    Mail.findOneAndUpdate(query, set, { new: true }).exec((err, data) => {
        if (!err) {
            data ?
                res.send({ status: 1, message: 'Success', data: data }) :
                res.send({ status: 0, message: 'No data found', data: "" })

        } else { res.send({ status: 0, message: 'failed', data: err }) }
    })
};

exports.send = (req, res, next) => {
    console.log(req.body, 'bodyy')

    let merchant = { email: 'puneetn91@gmail.com' }
    const mercResPath = path.join(publicPath, "sample.pug")
    let htmlM = pug.renderFile(mercResPath, { user: 'abc', enquiry: 'test' })
    mailer.sendMail(merchant, [htmlM]);
    res.send('some')

};

exports.delete = (req, res, next) => {
    let type = Object.keys(req.body)[0];
    let query = { [type]: req.body[type] };
    Mail.deleteMany(query, function (err, data) {
        if (!err) {
            res.send({ status: 1, message: 'delete', data: data })
        } else {
            res.send({ status: 0, message: 'Failed', data: err })
        }
    })
}

exports.update = (req, res, next) => {
    console.log('body', req.body);
    // let type = Object.keys(req.body)[0];
    // let query = { [type]: req.body[type] };
    let query = { _id: req.body.leadId }
    let set = {
        name: req.body.data.name,
        mobileno: req.body.data.mobileno,
        email: req.body.data.email,
        source: req.body.data.source,
        requirement: req.body.data.requirement,
        address: req.body.data.address,
        isAdded: true,
        deal: req.body.data.deal,
        status: req.body.data.status,
        companyName: req.body.data.companyName
    }
    // Mail.findOne(query).exec((err,data)=>{
    //     console.log(data, 'data')
    // })
    Mail.findOneAndUpdate(query, set, { new: true }).exec((err, data) => {
        if (err) {
            res.send({ status: 0, messsage: 'Update failed', data: err })
        } else {
            res.send({ status: 1, messsage: 'Updated', data: data })
        }
    })
};

// for testing only
exports.getMailData = (req, res, next) => {
    MailData.find({}).exec((err, data) => {
        res.send(data)
    })
}




