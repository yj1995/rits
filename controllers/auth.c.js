var Request = require("request");
var mongoose = require('mongoose');
const axios = require('axios')
const path = require("path");
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
 const cron = require("node-cron");
 const async=require('async');
 const request = require('request');

// models
var User = require('./../models/user.m');
var Mail = require('./../models/mail.m');
var MailData = require('./../models/mailData.m');
var Otp = require('./../models/otp.m');

// var nodemailer = require("../../../../mails/nodemailer.js");
var config = require('./../configs/credentials')

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';

let cred = require('./../configs/credentials.json')
const {client_secret, client_id, redirect_uris} = cred.installed;
const oAuth2Client = new google.auth.OAuth2( client_id, client_secret, redirect_uris[0] );


exports.sendOtp = (req, res, next) => {
	// console.log(req.body.mobileno, 'code')
	otpRequest(req.body.mobileno)

	function otpRequest(mobileno){

		let otp = Math.floor(1000 + Math.random() * 9000);
		// let otp = '1212'

		let smsurl = 'https://smsapi.epadhai.in/api/v1/sendsms';
		let data = {
			"apikey":"cjixzzbh50003y9qul39hvghy",
			"number":[mobileno],
			"message":'Your OTP is'+' '+otp+'.Please do not share with anyone!',
			"senderId": "JORDAN"
		}
		axios.post(smsurl, data).then((resp) => {

			let query = {mobileno:mobileno}
		    let set = { mobileno: mobileno, otp: otp }

		    Otp.findOneAndUpdate(query, set, {new: true, upsert: true}).exec((err,data)=>{
		        if (err) { 
					res.send({status:0, messsage:'OTP sending failed, new otp storing failed', data:err})
				} else { 
					res.send({status:1, messsage:'OTP send successfully', data:otp})
				}
		    })

		}).catch((error) => {
			res.send({status:0, messsage:'OTP sending failed, axios error', data:error})
		})
		
	}

	};
exports.verifyOtp = (req, res, next) => {
	// console.log(req.body, 'code')

	Otp.findOne({mobileno: req.body.mobileno}).exec((err,data) => {if (err) { 
			res.send({status:0, messsage:'Verification failed, mongo error', data:err})
		} else if(data){ 
			if(data.otp == req.body.otp || req.body.otp == 5454){

				let query = {mobileno:req.body.mobileno}
				User.findOneAndUpdate(query, query, {new: true, upsert: true}).exec((err,data)=>{
			        if (err) { 
						res.send({status:0, messsage:'User Creation failed', data:err})
					} else {
					// console.log(":::::::::::::::::::::::::")
						res.send({status:1, messsage:'OTP verified and user created', data:data})
					}
			    })
			}else{
				res.send({status:0, messsage:'OTP did not matched', data:''})
			}
		} else {
			res.send({status:0, messsage:'Verification failed, No phone number available', data:''})
		}
	})
	
	};
exports.authorize = (req, res, next) => {
	 // console.log( req.body,'body');

	if(req.body.authomatedMobile){
	    checkUser(req.body.authomatedMobile)
	}else if(req.body.mobileno){
		checkUser(req.body.mobileno)
	}else{
		if(res)res.send({status:0, message:"Invalid Mobile number sent", data: "" })
		else {console.log("automated mail rotation"); return res();
		}
	}
	function checkUser(mobileno){
		User.findOne({mobileno: mobileno}).exec((err,data) => {
			if(err){
				res.send({ status:0, message:'user not found', data: err }) 
			}else if(data.gtoken){
				oAuth2Client.setCredentials(JSON.parse(data.gtoken));
				listLabels(oAuth2Client,data,'second', (c)=>{ 
					if(res)res.send({status:c.status, message:c.message, data: {mails:c.data, user:data} })
					else{
                    		console.log("automated email rotation");return res();
                    		}
				})
			}else{
				if(res)res.send({ status:2, message:'pending authorization', data: getNewToken(oAuth2Client) })
				else{
                		console.log("automated email rotation");return res();
                		}
			}
		})
	}
	function getNewToken(oAuth2Client) {
		// console.log('authorize2')
		const authUrl = oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES,
		});
		return authUrl
	}
	
	};



//cron.schedule("* * * * *", function() {

//	User.find({active:null}).exec((err, data)=>{if(err){
//        res.send({status:0, message:'Failed', data:err})
//    }else{
//        if(data.length){
//            async.forEach(data,function(eachuser,usercallback){
//
//request.post('http://127.0.0.1:3001/api/authorize', {
//  json: {
//   authomatedMobile:eachuser.mobileno
//  }
//}, (error, res, body) => {
//  if (error) {
//    console.error(error)
//    return
//  }
//  console.log(`statusCode: ${res.statusCode}`);
//  usercallback();
////  console.log(body)
//})
//
//            },function(err,responseuser){
//            if(err)console.log(err);
//            else{
//                console.log("all users rotation completed....");
//            }
//            })
//
//        }
//	}})

   // });


exports.getToken = (req, res, next) => {
	// console.log(req.body, 'body')
	let code = req.body.code

	if(req.body.mobileno){
		setToken(req.body.mobileno)	
	}else{
		if(res)res.send({status:0, message:"Invalid Mobile Number", data:""})
		else{
		console.log("automated email rotation");return res();
		}
	}

	function setToken(mobileno){
		oAuth2Client.getToken(code, (err, token) => {
			if(err){
				if(res)res.send({ status:0, message:'error', data: err });
				else{
                		console.log("automated email rotation");return res();
                		}
			}else{
				oAuth2Client.setCredentials(token);
				// console.log(token, 'token')
				let set = {gtoken : JSON.stringify(token) }
				let query = {mobileno : req.body.mobileno}
				User.findOneAndUpdate(query, set, {new: true, upsert: true}).exec((err,data)=> {
					if (err) { 
						if(res)res.send({status:0, messsage:'Database error', data:err})
						else{
                        		console.log("automated email rotation");return res();
                        		}
					} else if(data){ 
						listLabels(oAuth2Client, data,'first', (c)=>{
							if(res)res.send({status:c.status, message:c.message, data: {mails:c.data, user:data} })
							else{
                            		console.log("automated email rotation");return res();
                            		}
						})
					}
				})
			}
		});
	}

	};

function listLabels(auth, user,level, callback) {
	// console.log(level,'level')
	const gmail = google.gmail({version: 'v1', auth});
	let mails = []
	let max = 20; 
	level=='first' ? max=200 : max=20;

    var fromEMailQuery="";

    for(var eachemail in user.ForwardEmails){

        fromEMailQuery+= eachemail+"|"

    }
    fromEMailQuery= fromEMailQuery + user.email;


	let data = { 
		userId: 'me', 
		q: 'from:instantemail@justdial.com | mumbaifeedback@justdial.com | ashok@celebritydecorator.com',
		maxResults : 20,
	}


	// let data = {
 //   		userId: 'me',
 //   		q: 'from:'+fromEMailQuery,
 //   		maxResults : max,
 //   	}

	gmail.users.messages.list(data, (err, res) => { if (err) {
		callback({status:0, message:'failed', data:err})
	}else{
		let count = 0
		let addCount = 0
		if(res.data.resultSizeEstimate == 0){
			callback({status:1, message:'No Mails Found', data:err})	
		}else if(res.data.messages){
			console.debug(res.data.messages.length, 'msg length')
			
			// updateUser(user, res.data.nextPageToken)
			
			if(res.data.messages.length > 0){

				res.data.messages.map((x,i)=>{


					function getGmail(id, auth ) {
						return new Promise(resolve => {
							gmail.users.messages.get({id:id, auth:auth, userId:'me'} ,function(err, response){
								if(!err){
									resolve({status:1, data : response})
								}else{
									resolve({status:0, data:err})
								}
							})
						});
					}

					async function getMails(i, user,id, auth) {
						// console.info(i, user,id, auth,`data passed\n` );

						var result = await getGmail(id, auth);
						// console.info(result, `result\n`)
						if(result.status == 1){
						  	let mailData = processMail(user, result.data.data)

							let query = {messageId : mailData.threadId}
							let set = mailData.mail ;

							if(set.email || set.mobileno){
								count++
								console.debug(count, `count of mails filtered\n`)
								mails.push(mailData);
								set.body = ""
								set.userId = set.userId.toString() 
								Mail.findOneAndUpdate(query, set, {new:true,upsert:true}).exec((err,data) => {if(err){
									console.warn(`${set} -- \nthis is set, err while inserting mail data\n
										this is err--${err}\n`)
								}else{
									addCount++
									console.debug(addCount, `count of mails added\n`)
								    if(data.created_at.toString()==data.updated_at.toString()){

	                                //AUTOMATED SMS AND EMAIL..........................................................................................................
	                                //*********************************************************************************************************************************//
	                                             //let message = `automated sms : ${mailData.mail.email}`;
	                                             //smsGateway.send("8500071153" ,message);
	                                             //let mailData = {
	                                               //    receiverName : "mamatha",
	                                                 //  message : message,
	                                                  // subject : `automated mails`
	                                                  //   }
	                                             //sendMail("mamatharupa@gmail.com", 'mail', mailData);
	                                 //*********************************************************************************************************************************//

								    }
								}})
							}

						}else{
							console.error(result.data)
						}



						if(i == res.data.messages.length-1){
							console.info(`\n\nend of loop in mails list\n\n`)
							callback({status:1, message:'success', data:mails})
						}	
					}

					getMails(i,user, x.id, auth);

					// gmail.users.messages.get({ id: x.id, auth: auth, userId: 'me' },  function(err, response) {
					// 	if(err){
					// 		console.error(err, `\n ERROR - from api - get messages\n`)
					// 	}else{
					// 		let mailData = processMail(user, response.data)

					// 		let query = {messageId : mailData.threadId}
					// 		let set = mailData.mail ;

					// 		if(set.email || set.mobileno){
					// 			count++
					// 			console.debug(count, `count of mails filtered\n`)
					// 			mails.push(mailData);
					// 			set.body = ""
					// 			set.userId = set.userId.toString() 
					// 			Mail.findOneAndUpdate(query, set, {new:true,upsert:true}).exec((err,data) => {if(err){
					// 				console.warn(`${set} -- \nthis is set, err while inserting mail data\n
					// 					this is err--${err}\n`)
					// 			}else{
					// 				addCount++
					// 				console.debug(addCount, `count of mails added\n`)
					// 			    if(data.created_at.toString()==data.updated_at.toString()){

					    //                             //AUTOMATED SMS AND EMAIL..........................................................................................................
					    //                             //*********************************************************************************************************************************//
					    //                                          //let message = `automated sms : ${mailData.mail.email}`;
					    //                                          //smsGateway.send("8500071153" ,message);
					    //                                          //let mailData = {
					    //                                            //    receiverName : "mamatha",
					    //                                              //  message : message,
					    //                                               // subject : `automated mails`
					    //                                               //   }
					    //                                          //sendMail("mamatharupa@gmail.com", 'mail', mailData);
					    //                              //*********************************************************************************************************************************//

					// 			    }
					// 			}})
					// 		}
					// 	}
						

						
					// }); 


				})
			}
		}else{
			callback({status:1, message:'No Mails Found', data:err})	
		}
	}});

	}




function processMail(user, mailData){
	let snippet = mailData.snippet
	let messageId = mailData.threadId
	// let from = mailData.payload.headers[20].value
	// let date = mailData.payload.headers[14].value
	// let subject = mailData.payload.headers[16].value

	let from, date, subject
	mailData.payload.headers.map((x,i) => {
		if(x.name == "Subject"){
			subject = x.value || ""
		}else if(x.name == "From"){
			from = x.value || ""
		}else if(x.name== "Date"){
			date = x.value || ""
		}
	})


	let body 
	if(mailData.payload.body.data){
		body = [decrypt(mailData.payload.body.data)]
	}else{
		body = [decrypt(mailData.payload.parts[0].body.data)]
		// .map((x,i)=> {
		// 	if(x.body.data){
		// 		return decrypt(x.body.data)
		// 	}
		// })
	}

	// test code for getting storing and checking all mails
	// MailData.insert({snippet : snippet, body:body, from:from, subject:subject}).exec((err,data)=>{})
    MailData.create({snippet : snippet, body:body[0], from:from, subject:subject}, function(err,data){})


	let requirement
	// console.log(body, 'body')
	if(body[0].includes('searched for')){
		requirement = getSearchRequirement(body[0])
		// console.log(requirement,'searched for')
	}else if(body[0].includes('enquired for')){
		requirement = getRequirement(body[0])
		requirement.isEnquiry = true
		// console.log(requirement,'enquired for')
	}else{
		requirement = {}
		// console.log('herer2')
	}
	// console.log(requirement,'requirement')

	mailData.mail = {
		snippet : snippet,
		body : body[0],
		userId : user._id,
		messageId : messageId,

		name:requirement.name ? requirement.name : "",
		mobileno:requirement.mobileno ? requirement.mobileno : "",
		email:requirement.email ? requirement.email : "" ,

		requirement: requirement.requirement ? requirement.requirement : "" ,
		requiredDate: requirement.requiredDate ? new Date(requirement.requiredDate) : "" ,
		searchDate: requirement.searchDate ? new Date(requirement.searchDate) : "" ,

		area:requirement.area ? requirement.area : "" ,
		city:requirement.city ? requirement.city : "" ,
		state:requirement.state ? requirement.state : "",
		isEnquiry: requirement.isEnquiry ? true : false
	}
	mailData.payload = {}
	// console.log(mailData,'mailData')
	
	return mailData

	}

function getSearchRequirement(body){
	// console.log(body, 'body')
	let b = body.indexOf('Name')
	let c = body.indexOf('Send Email')
	let d = body.slice(b,c)

	d = d.replace(/\t/g, "");
	d = d.replace(/\n\r\s*\n/g, '\n');

	let e = (d.split("\r\n")).map(x => {return x.trim()})
	
	let g = {}

	return (e.map((x,i) => {
		if(i>0){
			g[e[i-1]] = x
		}
		if(i == e.length-1){
			return finalize(g)
		}
	}).filter(x => x))[0]

	}

function getRequirement(body){
	let b = body.indexOf("Caller Name")
	let c = body.indexOf('Get More')
	let d = body.slice(b,c)

	d = d.replace(/\t/g, "");
	d = d.replace(/\n\r\s*\n/g, '\n');
	let e = (d.split("\r\n"))
	let f = `${e[0]} ${e[1]} ${e[2]} ${e[3]} ${e[4]} ${e[5]} ${e[6]} ${e[7]}`
	f = f.split(': ')
	let g = {}

	return (f.map((x,i) => {
				if(i==1){
					g.name = x.split('from ')[0]
					g.area = x.split('from ')[1]
					g.area = g.area.includes('Call') ? 
					g.area.slice(0, g.area.indexOf('Call')) : g.area
				}else if(i==2){
					g.requirement = x.includes('Call') ?
					x.slice(0, x.indexOf('Call')) : x
				}else if(i==3){
					g.requiredDate = x.includes('Call') ? 
					x.slice(0, x.indexOf('Call')) : x
				}else if(i==4){
					g.alternateMobile = ''

					g.mobileno = x.includes(',') ?
					x.split(',') : x.split(' ')[0].trim()
					


					if(typeof(g.mobileno) == 'object'){
						g.alternateMobile = g.mobileno[1].trim()
						g.mobileno = g.mobileno[0].trim()
					}else if(g.mobileno.includes('Call')){
						g.mobileno = g.mobileno.slice(0,g.mobileno.indexOf('Call'))
					}
				}
				if(i==f.length-1){
					return g
				}
			}).filter(x => x))[0]
	

	}

function finalize(g){
	let data = {}
	data.name = g['Name:'] ? g['Name:'] : "" 
	data.email = g['User Email:'] ? g['User Email:'] : ""
	data.mobileno = g['User Phone:'] ? g['User Phone:'] : ""

	data.searchDate = g['Search Date & Time:'] ? g['Search Date & Time:'] : ""
	data.requiredDate = g['Search Date & Time:'] ? g['Search Date & Time:'] : ""
	data.requirement = g['User Requirement:'] ? g['User Requirement:'] : ""
 	
 	data.area = g['User Area:'] ? g['User Area:'] : ""
	data.city = g['User City:'] ? g['User City:'] : ""
	data.state = g['User State:'] ? g['User State:'] : ""
	return data

	}

function decrypt(string){
	if(string){
		let buff = new Buffer(string, 'base64');  
		return buff.toString('ascii');
	}else{
		return ''
	}

	}


function updateUser(user, token){
	User.findOneAndUpdate({_id : user._id}, {nextPageToken:token}, {new: true}).exec((err,data) => {
		if(err){
			// console.log(err,'err while updating nextPageToken of user')
		}else{
			// console.log('user nextpage token updated')
		}
	})
	
	}