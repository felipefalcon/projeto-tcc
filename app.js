//  -----------------------------------------------------------------------------------------------------------------------
//	CONFIGURAÇÃO DO SERVIDOR NODE
//	-----------------------------------------------------------------------------------------------------------------------
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
	const dbName = "mydb";
	
//  ------------------------------------------------------------------------------------------------------------------------
//	CONFIGURAÇÃO DO MÓDULO DO MONGODB
//	------------------------------------------------------------------------------------------------------------------------
	var mongo = require('mongodb'); 
	const MongoClient = mongo.MongoClient;
	const url = "mongodb+srv://teste:teste123@mongo-t-qnccn.gcp.mongodb.net/test?retryWrites=true&w=majority";
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
			var myobj = {	email: req.body.email,
							name: req.body.name,
							lastname: req.body.lastname, 
							age: req.body.age, 
							gender: req.body.gender,  
							password: req.body.password,
							pics_url: {
								main_pic: "https://i.imgur.com/XTJcAbt.png"
							}
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
			var dbo = db.db("mydb");
			dbo.collection("users").findOne({email: req.body.email, password: req.body.password}, { projection: { password: 0} }, function(err, result) {
				if (err) throw err;
				res.json(result); 
			});
			db.close();
		}); 
	});

//  [ READ - GET ] ROTA: retorna dados de uma conta com base no email
	app.get('/get-user', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
			dbo.collection("users").findOne({email: req.query.email}, { projection: { password: 0} }, function(err, result) {
				if (err) throw err;
				res.json(result); 
			});
			db.close();
		}); 
	});
	
//  [ READ - GET ] ROTA: retorna todos os usuários do banco
	app.get('/get-users', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
			var objectIdUser = new require('mongodb').ObjectID(req.query._id);
			dbo.collection("users").find({_id: {$ne : objectIdUser}}, { projection: { password: 0}}).toArray(function(err, result) {
				if (err) throw err;
				if(result){
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
			var dbo = db.db("mydb");
			var myquery = {email: req.query.email};
			var newvalues = {$set: { "pics_url.main_pic": req.query.pic_url}};
			dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
				if (err) throw err;
				res.json({ ok: 'ok' }); 
			});
			db.close();
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza a foto secundária do usuário (Primeira)
	app.get('/upd-user-sec-pic-1', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
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
			var dbo = db.db("mydb");
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
			var dbo = db.db("mydb");
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
			var dbo = db.db("mydb");
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
			var dbo = db.db("mydb");
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
			var query = {_id: objectIdUserFrom};
			var query2 = {_id: objectIdUserTo};
			var newvalues = {$push: 	{ messages: req.query.message }};
			dbo.collection("users").updateOne(query, newvalues, {upsert: true}, function(err, result) {
				if (err) throw err;
				//res.json({ ok: 'ok' }); 
			});
			dbo.collection("users").updateOne(query2, newvalues, {upsert: true}, function(err, result) {
				if (err) throw err;
				res.json({ ok: 'ok' }); 
			});
			db.close();
		}); 
	});

//  [ DELETE - GET ] ROTA: deleta um usuário
	app.get('/del-user', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
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
			var dbo = db.db("mydb");
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
			var dbo = db.db("mydb");
			var myObj = req.query.evento;
			myObj.participants = [req.query.user];
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
			var dbo = db.db("mydb");
			dbo.collection("events").find({}).toArray(function(err, result) {
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

//  [ READ - GET ] ROTA: retorna todos os eventos do banco
	app.get('/get-events-w-u', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
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
	
//  [ READ - GET ] ROTA: verifica se o email informado para recuperação existe no banco e em seguida envia o email de rec.
	app.get('/send-email-recover', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
			dbo.collection("users").findOne({email: req.query.email}, function(err, result) {
				if (err) throw err;
				if(result){
					sendEmailRecover(result.email, result.password);
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
				subject: 'Hello ✔', // Subject line
				text: 'Hello world?', // plain text body
				html: '<b>SUA SENHA É '+ password_to_send  // html body
			};
			// send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error);
				}
			});
	}



