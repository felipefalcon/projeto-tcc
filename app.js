//  -----------------------------------------------------------------------------------------------------------------------
//	CONFIGURAÇÃO DO SERVIDOR NODE
//	-----------------------------------------------------------------------------------------------------------------------
// user: 'projeto-tcc-2020@outlook.com',
// 					pass: 'Projeto2020'
					// USuario login é o mesmo do DB ATLAS MONGO => Senha: PrLeRo20
	var express = require('express');
	var compression = require('compression');

	var app = express();

	var bodyParser = require('body-parser');  
	var urlencodedParser = bodyParser.urlencoded({ extended: false });  

	app.use(compression());
	app.use(express.static(__dirname + '/public'));

	var port = process.env.PORT || 8080;

	app.listen(port, '0.0.0.0', function() {
		console.log("PORTA: "+port);
	});

//	NOME DO BANCO DE DADOS
	const dbName = "leRo_DB";
	const apiUrl = 'https://api.imgur.com/3/image';
	const apiKey = '4409588f10776f7';
	
//  ------------------------------------------------------------------------------------------------------------------------
//	CONFIGURAÇÃO DO MÓDULO DO MONGODB
//	------------------------------------------------------------------------------------------------------------------------
	var mongo = require('mongodb'); 
	const MongoClient = mongo.MongoClient;
	const url = "mongodb+srv://tcc2020:zDOo5kKVvZ0JMzAJ@lero-vjuos.gcp.mongodb.net/test?retryWrites=true&w=majority";
	const paramsM = { useNewUrlParser: true, useUnifiedTopology: true };

//  ------------------------------------------------------------------------------------------------------------------------
//	ROTAS
//	------------------------------------------------------------------------------------------------------------------------
//	ROTAS [USUÁRIO]
//	------------------------------------------------------------------------------------------------------------------------
//  [ CREATE - POST ] ROTA: insere no banco um novo usuário
	app.post('/crt-user', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			let dtNasc = new Date(req.body.dt_nasc);
			let dtNow = new Date();
			var myobj = {	email: req.body.email,
							name: req.body.name,
							lastname: req.body.lastname,
							dt_nasc:  dtNasc,
							gender: req.body.gender,  
							password: req.body.password,
							pics_url: {
								main_pic: "https://i.imgur.com/XTJcAbt.png",
								sec_pics: []
							},
							dt_register: dtNow
						};
			dbo.collection("users").insertOne(myobj, function(err, res) {
				if (err) throw err;
			});
			res.send("");
			db.close();
		}); 
	});
	
//  [ READ - POST ] ROTA: verifica se o email e senha correspondem a uma conta
	app.post('/con-user', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			dbo.collection("users").findOne({email: req.body.email, password: req.body.password}, { projection: { password: 0, dt_register: 0} }, function(err, result) {
				if (err) throw err;
				result.age = calcAgeOfUser(result.dt_nasc);
				res.json(result); 
			});
			db.close();
		}); 
	});

	function calcAgeOfUser(dtNasc){
		if(typeof dtNasc == "undefined") return "?";
		let dtNow = new Date();
		let age = dtNow.getFullYear()-dtNasc.getFullYear();
		if(dtNow.getMonth() <= dtNasc.getMonth()){
			age--;
		}else if(dtNow.getDate() <= dtNasc.getDate()){
			age--;
		}
		return age || "?";
	}

//  [ READ - GET ] ROTA: retorna os dados da API do Imgur
	app.get('/get-imgur-params', urlencodedParser, function (req, res) {
		res.json([apiUrl, apiKey]);
	});

//  [ READ - GET ] ROTA: retorna o horário do servidor (Horário certo - idenpendente do horario do usuário)
	app.get('/get-time-server', urlencodedParser, function (req, res) {
		res.send((new Date()));
	});

	function getTimeServer(){
		let dateNow = new Date();
		dateNow.setHours(dateNow.getHours()-3);
		return dateNow;
	}

//  [ READ - GET ] ROTA: retorna dados de uma conta com base no email
	app.get('/get-user', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			dbo.collection("users").findOne({email: req.query.email}, { projection: { password: 0, dt_register: 0} }, function(err, result) {
				if (err) throw err;
				if(result){
					result.age = calcAgeOfUser(result.dt_nasc);
				}
				res.json(result); 
			});
			db.close();
		}); 
	});

//  [ READ - GET ] ROTA: retorna se uma conta existe com base no email
	app.get('/get-user-exist', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			dbo.collection("users").findOne({email: req.query.email}, function(err, result) {
				if (err) throw err;
				if(result){
					return res.json({oh_no: "oh-no"});
				}
				res.json(result); 
			});
			db.close();
		}); 
	});
	
//  [ READ - GET ] ROTA: retorna todos os usuários do banco
	app.get('/get-users', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			let perPage = 12;
			let page = req.query.page * perPage;
			var objectIdUser = new require('mongodb').ObjectID(req.query._id);
			dbo.collection("users").find({_id: {$ne : objectIdUser}}, { projection: { password: 0, dt_register: 0}}).skip(page).limit(perPage).toArray(function(err, result) {
				if (err) throw err;
				if(result){
					result.forEach(function(item){
						item.age = calcAgeOfUser(item.dt_nasc);
					});
					return res.json(result);
				}
				res.json({oh_no: "oh-no"});
			});
			db.close();
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza a foto principal do usuário
	app.get('/upd-user-main-pic', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var myquery = {email: req.query.email};
			var newvalues = {$set: { "pics_url.main_pic": req.query.pic_url}};
			dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
				if (err) throw err;
				res.json({ ok: 'ok' }); 
			});
			db.close();
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza dados do usuário
	app.get('/upd-user', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var newInfos = req.query.info_user;
			var objectIdUser = new require('mongodb').ObjectID(newInfos._id);
			let dtNasc = new Date(newInfos.dt_nasc);
			let nameSplit = newInfos.name.split(" ");
			let firstName = nameSplit.shift();
			let lastName = nameSplit.join(" ");
			var newvalues = {$set: { "name": firstName, "lastname": lastName, "dt_nasc": dtNasc, "about": newInfos.about,
			 "work" : newInfos.work, "pics_url.main_pic" : newInfos.main_pic, "pics_url.sec_pics" : newInfos.sec_pics, "fix_local": newInfos.fix_local}};
			dbo.collection("users").findOneAndUpdate({ _id: objectIdUser }, newvalues, {upsert: true, returnOriginal: false}, function(err, result) {
				if (err) throw err;
				result = result.value;
				result.age = calcAgeOfUser(result.dt_nasc);
				res.json(result); 
			});
			db.close();
		}); 
	});


//  [ UPDATE - GET ] ROTA: atualiza a foto secundária do usuário (Primeira)
	app.get('/upd-user-sec-pic-1', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var myquery = {email: req.query.email};
			var newvalues = {$set: { "pics_url.sec_pic1": req.query.pic_url}};
			dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
				if (err) throw err;
				res.json({ ok: 'ok' }); 
			});
			db.close();
		}); 
	});
	
//  [ UPDATE - GET ] ROTA: atualiza a foto secundária do usuário (Segunda)
	app.get('/upd-user-sec-pic-2', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var myquery = {email: req.query.email};
			var newvalues = {$set: { "pics_url.sec_pic2": req.query.pic_url}};
			dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
				if (err) throw err;
				res.json({ ok: 'ok' }); 
			});
			db.close();
		}); 
	});
	
//  [ UPDATE - GET ] ROTA: atualiza a foto secundária do usuário (Terceira)
	app.get('/upd-user-sec-pic-3', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var myquery = {email: req.query.email};
			var newvalues = {$set: { "pics_url.sec_pic3": req.query.pic_url}};
			dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
				if (err) throw err;
				res.json({ ok: 'ok' }); 
			});
			db.close();
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza dados do usuário (idade, trabalho, etc)
	app.get('/upd-user-profile', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var myquery = {email: req.query.email};
			var newvalues = {$set: 	{ 	about: req.query.about, 
										work: req.query.work, 
										age: req.query.age, 
										gender: req.query.gender 
									}
							};
			dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
				if (err) throw err;
				res.json({ ok: 'ok' }); 
			});
			db.close();
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza dados do usuário (localização)
	app.get('/upd-user-location', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var myquery = {email: req.query.email};
			var newvalues = {$set: 	{ location: req.query.location }};
			dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
				if (err) throw err;
				res.json({ ok: 'ok' }); 
			});
			db.close();
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza mensagens (from e to)
	app.get('/upd-users-messages', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var objectIdUserFrom = new require('mongodb').ObjectID(req.query._id_from);
			var objectIdUserTo = new require('mongodb').ObjectID(req.query._id_to);
			var message = req.query.message;
			message.date = getTimeServer();
			message.day = message.date.getDate();
			message.status = 1;
			var message2 = {...message};
			message2.status = 0;
			// dbo.collection("users").updateOne({_id: objectIdUserFrom}, {$push: 	{ messages: {"$each": [message] , "$position": 0}}}, function(err, result) {
			// 	if (err) throw err;
			// });
			// dbo.collection("users").updateOne({_id: objectIdUserTo}, {$push: 	{ messages: {"$each": [message2] , "$position": 0}}}, function(err, result) {
			// 	if (err) throw err;
			// 	res.json({ ok: "ok"});
			// });
			// db.close();

			Promise.all([
				queryPromise({_id: objectIdUserFrom}, {$push: 	{ messages: {"$each": [message] , "$position": 0}}}),
				queryPromise({_id: objectIdUserTo}, {$push: 	{ messages: {"$each": [message2] , "$position": 0}}})
			]).then(function(result) {
				// result is an array of responses here
				console.log(result[0]);
				db.close();
				res.json({ ok: "ok"});
			}).catch(function(err) {
				console.log(err);
				db.close();
			});
		
		
			function queryPromise(query, newValues) {
				return new Promise(function(resolve, reject) {
					dbo.collection("users").updateOne(query, newValues, function(err, resp) {
						if (err) {
							reject(err);
						} else {
							resolve(resp);
						}
					});
				})
			}

		}); 
	});

	// OLD - 01/02/2020
//  [ UPDATE - GET ] ROTA: atualiza mensagens (from e to)
	// app.get('/upd-users-messages', urlencodedParser, function (req, res) {
	// 	MongoClient.connect(url, paramsM, function(err, db) {
	// 		if (err) throw err;
	// 		var dbo = db.db(dbName);
	// 		var objectIdUserFrom = new require('mongodb').ObjectID(req.query._id_from);
	// 		var objectIdUserTo = new require('mongodb').ObjectID(req.query._id_to);
	// 		var message = req.query.message;
	// 		message.date = getTimeServer();
	// 		message.status = 1;
	// 		var message2 = {...message};
	// 		message2.status = 0;
	// 		dbo.collection("users").updateOne({_id: objectIdUserFrom}, {$push: 	{ messages: {"$each": [message] , "$position": 0}}}, function(err, result) {
	// 			if (err) throw err;
	// 		});
	// 		dbo.collection("users").updateOne({_id: objectIdUserTo}, {$push: 	{ messages: {"$each": [message2] , "$position": 0}}}, function(err, result) {
	// 			if (err) throw err;
	// 			res.json({ ok: "ok"});
	// 		});
	// 		db.close();
	// 	}); 
	// });

//  !!!OLD!!! [ UPDATE - GET ] ROTA: atualiza mensagens (from e to)
	// app.get('/upd-users-messages', urlencodedParser, function (req, res) {
	// 	MongoClient.connect(url, paramsM, function(err, db) {
	// 		if (err) throw err;
	// 		var dbo = db.db(dbName);
	// 		var objectIdUserFrom = new require('mongodb').ObjectID(req.query._id_from);
	// 		var objectIdUserTo = new require('mongodb').ObjectID(req.query._id_to);
	// 		var query = {_id: { "$in": [objectIdUserFrom, objectIdUserTo]}};
	// 		var newvalues = {$push: 	{ messages: {"$each": [req.query.message] , "$position": 0}}};
	// 		dbo.collection("users").updateMany(query, newvalues, {upsert: true}, async function(err, result) {
	// 			if (err) throw err;
	// 			res.json({ ok: "ok"});
	// 		});
	// 		db.close();
	// 	}); 
	// });

//  [ UPDATE - GET ] ROTA: atualiza status das mensagens (Deixa igual como está no client)
	// app.get('/upd-users-status-messages', urlencodedParser, function (req, res) {
	// 	MongoClient.connect(url, paramsM, function(err, db) {
	// 		if (err) throw err;
	// 		var dbo = db.db(dbName);
	// 		var objectIdUser = new require('mongodb').ObjectID(req.query._id);
	// 		dbo.collection("users").updateOne({_id: objectIdUser}, {$set: 	{ messages: req.query.messages }}, function(err, result) {
	// 			if (err) throw err;
	// 			res.json({ ok: "ok"});
	// 		});
	// 		db.close();
	// 	}); 
	// });

//  [ UPDATE - GET ] ROTA: atualiza status das mensagens (Deixa igual como está no client)
	app.get('/upd-users-status-messages', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var objectIdUserFrom = new require('mongodb').ObjectID(req.query._id_from);
	 		var objectIdUserTo = req.query._id_to;
			dbo.collection("users").findOne({_id: objectIdUserFrom}, function(err, resultUser) {
				if (err) throw err;
				if(resultUser === "undefined") return res.json({ oh_no: "oh-no"});
				let resultMessages = resultUser.messages;
				let resultMessagesLength = resultMessages.length;
				for(let i = 0; i < resultMessagesLength; ++i){
					if(resultMessages[i].author == objectIdUserTo){
						resultMessages[i].status = 1;
					}
				}
				dbo.collection("users").updateOne({_id: objectIdUserFrom}, {$set: 	{ messages: resultMessages }}, function(err, result) {
					if (err) throw err;
					res.json(resultUser);
					db.close();
				});
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: Deleta só as mensagens de um usuário em especifico
	app.get('/del-user-messages', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var objectIdUserFrom = new require('mongodb').ObjectID(req.query._id_from);
			var objectIdUserTo = req.query._id_to;
			dbo.collection("users").findOne({_id: objectIdUserFrom}, function(err, resultUser) {
				if (err) throw err;
				if(resultUser === "undefined") return res.json({ oh_no: "oh-no"});
				let resultMessages = resultUser.messages;
				let resultMessages2 = resultMessages.filter(function(data){
					return data.author != objectIdUserTo;
				});

				let resultMessages3 = resultMessages2.filter(function(data){
					return data.author == objectIdUserFrom && data.subject != objectIdUserTo;
				});

				// for(let i = 0; i < resultMessagesLength; ++i){
				// 	if(resultMessages[i].author == objectIdUserTo){
				// 		resultMessages[i].status = 1;
				// 	}
				// }
				dbo.collection("users").updateOne({_id: objectIdUserFrom}, {$set: 	{ messages: resultMessages3 }}, function(err, result) {
					if (err) throw err;
					res.json(resultUser);
					db.close();
				});
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza status das mensagens (Deixa igual como está no client)
	// app.get('/upd-users-rd-messages', urlencodedParser, function (req, res) {
	// 	MongoClient.connect(url, paramsM, function(err, db) {
	// 		if (err) throw err;
	// 		var dbo = db.db(dbName);
	// 		var objectIdUser = new require('mongodb').ObjectID(req.query._id);
	// 		dbo.collection("users").updateOne({_id: objectIdUser}, {$set: 	{ messages_read: req.query.messages_read }}, function(err, result) {
	// 			if (err) throw err;
	// 			res.json({ ok: "ok"});
	// 		});
	// 		db.close();
	// 	}); 
	// });

//  [ DELETE - GET ] ROTA: deleta um usuário
	app.get('/del-user', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			dbo.collection("users").deleteOne({email: req.query.email}, function(err, result) {
				if (err) throw err;
				res.json(result);
			});
			db.close();
		}); 
	});

//  [ DELETE - GET ] ROTA: deleta um usuário (Através do administrador)
	app.get('/admin-del-user', urlencodedParser, function (req, res) {
		var objectId = new require('mongodb').ObjectID(req.query._id);
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			dbo.collection("users").deleteOne({_id: objectId}, function(err, result) {
				if (err) throw err;
				res.json(result);
			});
			db.close();
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza dados do usuário (eventos)
	app.get('/crt-event', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var myObj = req.query.evento;
			myObj.participants = [req.query._id];
			dbo.collection("events").insertOne(myObj, function(err, res) {
				if (err) throw err;
			});
			res.send({ok: "ok"});
			db.close();
		}); 
	});

//  [ READ - GET ] ROTA: retorna todos os eventos do banco
	app.get('/get-events', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			dbo.collection("events").find({}).toArray(function(err, result) {
				if (err) throw err;
				if(result) res.json(result);
			});
			db.close();
		}); 
	});

//  [ READ - GET ] ROTA: retorna todos os eventos do banco
	app.get('/get-events-w-u', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			dbo.collection("events").find({participants: {$not: {$elemMatch: {_id: req.query._id}}}}).toArray(function(err, result) {
				if (err) throw err;
				if(result){
					res.json(result);
				}else{
					res.json({oh_no: "oh-no"});
				}
			});
			db.close();
		}); 
	});

	//  [ UPDATE - GET ] ROTA: atualiza mensagens (from e to)
	app.get('/upd-event', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var objectId = new require('mongodb').ObjectID(req.query._id);
			var query = {_id: objectId};
			var newvalues = {$push: 	{ participants: req.query.user }};
			dbo.collection("events").updateOne(query, newvalues, {upsert: true}, function(err, result) {
				if (err) throw err;
				res.json({ ok: 'ok' }); 
			});
			db.close();
		}); 
	});

	//  [ UPDATE - GET ] ROTA: atualiza mensagens (from e to)
	app.get('/exit-event', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var objectId = new require('mongodb').ObjectID(req.query._id);
			var query = {_id: objectId};
			var newvalues = {$pull: 	{ participants: req.query.user }};
			dbo.collection("events").updateOne(query, newvalues, function(err, result) {
				if (err) throw err;
				res.json({ ok: 'ok' }); 
			});
			db.close();
		}); 
	});

	app.post('/upload-img', function (req, res, next) {
		// req.file is the `avatar` file
		// req.body will hold the text fields, if there were any
	  })

//  ------------------------------------------------------------------------------------------------------------------------
//	CONFIGURAÇÃO DO MÓDULO NODEMAILER
//	------------------------------------------------------------------------------------------------------------------------
	const nodemailer = require('nodemailer');
	const crypto = require('crypto');
	
//  [ READ - GET ] ROTA: verifica se o email informado para recuperação existe no banco e em seguida envia o email de rec.
	app.get('/send-email-recover', urlencodedParser, function (req, res) {
		
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var randPass = () => {
				var result           = '';
				var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
				var charactersLength = characters.length;
				for ( var i = 0; i < 8; i++ ) {
				   result += characters.charAt(Math.floor(Math.random() * charactersLength));
				}
				return result;
			 };
			var newPassword = randPass();
			var newPasswordMd5 = crypto.createHash('md5').update(newPassword.toString()).digest("hex");
			// mystr += mykey.final('hex');

			dbo.collection("users").updateOne({email: req.query.email}, {$set: {password: newPasswordMd5}}, function(err, result) {
				if (err) throw err;
			});
			dbo.collection("users").findOne({email: req.query.email}, function(err, result) {
				if (err) throw err;
				if(result){
					sendEmailRecover(result.email, newPassword);
					res.json({ ok: 'ok' }); 
				}else{
					res.json({ oh_no: 'oh-no' }); 
				}
			});
			db.close();
		}); 
	});
	
//  [ FUNÇÃO ] recebe email como parametro e envia um email de recuperação para ele
	function sendEmailRecover(email_to_send, password_to_send){
		let transporter = nodemailer.createTransport({
				host: 'smtp-mail.outlook.com',
				secureConnection: false, // TLS requires secureConnection to be false
				port: 587, // port for secure SMTP
				tls: {
					ciphers:'SSLv3'
				},
				auth: {
					user: 'projeto-tcc-2020@outlook.com',
					pass: 'Projeto2020'
				}
		});
		let mailOptions = {
				from: '"projeto-tcc-2020@outlook.com', // sender address
				to: email_to_send, // list of receivers
				subject: 'Recuperação de conta', // Subject line
				text: 'Hello world?', // plain text body
				html: '<b>SUA nova palavra passe É '+ password_to_send  // html body
			};
			// send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error);
				}
			});
	}



