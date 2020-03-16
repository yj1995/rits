var multer = require('multer');
var mongoose = require('mongoose');

const path = require("path");
var pug = require("pug");
var mailer = require("../configs/mailer.js");
var smsGateway = require("../configs/smsGateway.js")
const publicPath = path.resolve(__dirname, "../public/templates/emails/");

var User = require('./../models/user.m');
var Image = require('./../models/image.m');
var Mail = require('./../models/mail.m');
var Package = require('./../models/package.m');
var Quotation = require('./../models/quotations.m');
var storage = multer.diskStorage({
      destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' +file.originalname.replace(/ /g,'') )
    }
})
var uploader = multer({ storage: storage }).single('file')

exports.upload = (req, res, next) => {
    console.log(req.params, 'req.query')

    uploader(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(500).json(err)
        } else if (err) {
          return res.status(500).json(err)
        }else{
          let query = {userId: req.params.userId}
          let set = {name : req.file.filename, userId: req.params.userId }
          Image.findOneAndUpdate(query, set, {new:true, upsert:true}).exec((err, data)=>{if(!err){
              return res.send({status:1, message:'Success', data:data}) 
          }else{ 
              return res.send({status:0, message:'Failed', data:err})
          }})
        }
	    

    })
};

exports.check = (req,res,next) => {
  Image.findOne({userId : req.params.userId}).exec((err,data) => {if(!err){
    data ?
      res.send({status:1, message:'success', data:data}) :
      res.send({status:0, message:'no data found', data:data})
  }else{
    res.send({status:0, message:'err in mongo', data:err})
  }})
}

exports.sendQuote = (req, res, next) => {
    console.log(req.body, 'bodyy')
    let body = req.body

    Package.findOne({_id : req.body.packageId}).exec((err,resy) => {if(!err){
        if(resy){
            console.log('got resy');
             Mail.findOne({_id : req.body.leadId}).exec((err,data) => {if(!err){
           //  let url = `https://captain.ritsworld.com/uploads/${resy.name}`
                       var url = resy.pdfUrl;
                        var arr = url.split(' ');
                                                           var modifiedStr = arr.join('%20');

//                                                           return modifiedStr;
//                       let message = "The JustDial merchant has sent you quotation for your enquiry, please check the below link :"+modifiedStr;
                        var companynameinmsg= (data && data.companyName==undefined) ? '' : data.companyName
                        var message = "Hello, :"+companynameinmsg +"thanks you for the enquiry. Please click on the link here to know more. "+ modifiedStr;
    console.log("EMaillllllllllllllllllllllllllllllll",message,companynameinmsg)

                    smsGateway.send(data.mobileno ,message)
                      // smsGateway.send("9742853638",message)
                       // smsGateway.send(parseInt(req.body.mobileno), message)

                       // if(body.email){
                           let mailData = {
                               username : data.name,
                               companyName:data.companyName,
                               mobileno:data.mobileno,
                               message :"Please find the details of the information requested in the link below:-",
                               pdflink:modifiedStr,
                               subject :data.companyName==undefined ? '' : data.companyName +" - Quotation"
                           }
//                        sendMail('support@ritsworld.com', 'mail', mailData)
                            sendMail(data.email, 'mail', mailData)
                            console.log(mailData,"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",data);
                       // }
                         const newQuotation = new Quotation({
                                functionId :req.body.functionId,
                                packageId : req.body.packageId,
                                userId:req.body.userId,
                                leadId: req.body.leadId
                            })
                            newQuotation.save().then(finaldata => {
                                 updateMail(data.email)
                                 res.send({status:1, message:"Quote sent successfully", data:finaldata})

                            })

              }else{
                res.send({status:0, message:'err in mongo', data:err})
              }})

        }else{
            res.send({status:0, message:'No quotation found', data:''})
        }
    }else{ 
        res.send({status:0, message:'db error', data:err})
    }})
};


function updateMail(mid){
    Mail.findOneAndUpdate({_id : mid }, {quoted:true}, {new:true}).exec((err,data) => {
        if(err) {console.log(err, 'err while updating maildata quoted')}
        else{console.log(data, 'maildata2')}
    })
    }

function sendMail(to, format, data){
    const mailPug = path.join(publicPath, `${format}.pug`)



    let html = pug.renderFile(mailPug, {username:data.username,companyName: data.companyName, message: data.message,mobileno:data.mobileno,subject:data.subject,pdflink:data.pdflink})
    mailer.sendGmail(to, [html, data.subject]);
    }
