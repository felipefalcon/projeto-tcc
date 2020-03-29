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
			let dtNascPure = new Date(newInfos.dt_nasc);
			let dtNasc = new Date(dtNascPure.getFullYear(), dtNascPure.getMonth()+1, dtNascPure.getDate()+1);
			dtNasc.setDate(dtNasc+1);
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
							conversations: [],
							work: "",
							about: "",
							fix_local: "",
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
		if(age > 99 || age < 0) age = "?";
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

//  [ READ - GET ] ROTA: retorna as conversas de uma conta com base no email
	app.get('/get-user-msgs', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var objectIdUser = new require('mongodb').ObjectID(req.query._id);
			dbo.collection("users").findOne({_id: objectIdUser}, { projection: { conversations: 1} }, function(err, result) {
				if (err) throw err;
				res.json(result); 
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
			let dtNascPure = new Date(newInfos.dt_nasc);
			let dtNasc = new Date(dtNascPure.getFullYear(), dtNascPure.getMonth()+1, dtNascPure.getDate()+1);
			let nameSplit = newInfos.name.split(" ");
			let firstName = nameSplit.shift();
			let lastName = nameSplit.join(" ");
			let secPics = newInfos.sec_pics || [];
			var newvalues = {$set: { "name": firstName, "lastname": lastName, "dt_nasc": dtNasc, "about": newInfos.about,
			 "work" : newInfos.work, "pics_url.main_pic" : newInfos.main_pic, "pics_url.sec_pics" : secPics, "fix_local": newInfos.fix_local}};
			dbo.collection("users").findOneAndUpdate({ _id: objectIdUser }, newvalues, {upsert: true, returnOriginal: false}, function(err, result) {
				if (err) throw err;
				result = result.value;
				result.age = calcAgeOfUser(result.dt_nasc);
				res.json(result); 
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

			Promise.all([
				promiseGetUser({_id: objectIdUserFrom}),
				promiseGetUser({_id: objectIdUserTo})
			]).then(function(result) {
				// result is an array of responses here
				let userAuthor = result[0];
				let userSubject = result[1];
				let foundId = false;
				let copyConversation = "";
				let conversationsAuthorLength = userAuthor.conversations.length;
				let conversationsSubjectLength = userSubject.conversations.length;
				for(let i = 0; i < conversationsAuthorLength; ++i){
					if(userAuthor.conversations[i]._id == req.query._id_to){
						userAuthor.conversations[i].messages.unshift(message);
						userAuthor.conversations[i].newmsgs = 0;
						copyConversation = userAuthor.conversations[i];
						userAuthor.conversations.splice(i, 1);
						foundId = true;
						break;
					}
				}
				if(!foundId) userAuthor.conversations.unshift({_id: req.query._id_to, messages: [message], newmsgs: 0});
				if(copyConversation != "") userAuthor.conversations.unshift(copyConversation);

				foundId = false;
				copyConversation = "";
				for(let i = 0; i < conversationsSubjectLength; ++i){
					if(userSubject.conversations[i]._id == req.query._id_from){
						userSubject.conversations[i].messages.unshift(message);
						userSubject.conversations[i].newmsgs++;
						copyConversation = userSubject.conversations[i];
						userSubject.conversations.splice(i, 1);
						foundId = true;
						break;
					}
				}
				if(!foundId) userSubject.conversations.unshift({_id: req.query._id_from, messages: [message], newmsgs: 1});
				if(copyConversation != "") userSubject.conversations.unshift(copyConversation);

				Promise.all([
					promiseUpdUser({_id: objectIdUserFrom}, {$set: 	{ conversations: userAuthor.conversations}}),
					promiseUpdUser({_id: objectIdUserTo},   {$set: 	{ conversations: userSubject.conversations}})
				]).then(function() {
					db.close();
					res.json({ ok: "ok"});
				}).catch(function(err) {
					console.log(err);
					db.close();
				});

			}).catch(function(err) {
				console.log(err);
				db.close();
			});
		
		
			function promiseUpdUser(query, newValues) {
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

			function promiseGetUser(query) {
				return new Promise(function(resolve, reject) {
					dbo.collection("users").findOne(query, {projection: {conversations: 1}}, function(err, resp) {
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

//  [ UPDATE - GET ] ROTA: atualiza status das mensagens (Deixa igual como está no client)
	app.get('/upd-users-status-messages', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var objectIdUserFrom = new require('mongodb').ObjectID(req.query._id_from);
			var objectIdUserTo = req.query._id_to;
			var needUpd = true;
			dbo.collection("users").findOne({_id: objectIdUserFrom}, function(err, resultUser) {
				if (err) throw err;
				if(resultUser === "undefined") return res.json({ oh_no: "oh-no"});
				let conversationsLength = resultUser.conversations.length;
				for(let i = 0; i < conversationsLength; ++i){
					if(resultUser.conversations[i]._id == objectIdUserTo){
						if(resultUser.conversations[i].newmsgs == 0){
							needUpd = false;
							break;
						}
						resultUser.conversations[i].newmsgs = 0;
						break;
					}
				}
				if(!needUpd) {
					res.json(resultUser);
					db.close();
				}else{
					dbo.collection("users").updateOne({_id: objectIdUserFrom}, {$set: 	{ conversations: resultUser.conversations }}, function(err, result) {
						if (err) throw err;
						res.json(resultUser);
						db.close();
					});
				}
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
				dbo.collection("users").updateOne({_id: objectIdUserFrom}, {$set: 	{ conversations: resultUser.conversations.filter(function(item){ return item._id != objectIdUserTo;}) }}, function(err, result) {
					if (err) throw err;
					res.json(resultUser);
					db.close();
				});
			});
		}); 
	});

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



