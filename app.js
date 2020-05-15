//  -----------------------------------------------------------------------------------------------------------------------
//	CONFIGURAÇÃO DO SERVIDOR NODE
//	-----------------------------------------------------------------------------------------------------------------------
// user: 'projeto-tcc-2020@outlook.com',
// 					pass: 'Projeto2020'
					// USuario login é o mesmo do DB ATLAS MONGO => Senha: PrLeRo20

	const nodeHost = "https://tcc-lero.herokuapp.com/";
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
			let dtNascPure = new Date(req.body.dt_nasc);
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
							pass_redef: false,
							dt_register: dtNow
						};
			dbo.collection("users").insertOne(myobj, function(err, result) {
				if (err) throw err;
				res.send("");
				db.close();
			});
		}); 
	});
	
//  [ READ - POST ] ROTA: verifica se o email e senha correspondem a uma conta
	app.post('/con-user', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			dbo.collection("users").findOne({email: req.body.email, password: req.body.password}, { projection: { password: 0, dt_register: 0} }, function(err, result) {
				if (err) throw err;
				if(result) result.age = calcAgeOfUser(result.dt_nasc);
				res.json(result); 
				db.close();
			});
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
			dbo.collection("users").findOne({email: req.query.email}, { projection: { password: 0, dt_register: 0, pass_redef: 0} }, function(err, result) {
				if (err) throw err;
				if(result){
					result.age = calcAgeOfUser(result.dt_nasc);
					result.conversations.sort(function(item, item2){return (new Date(item2.messages[item2.messages.length-1].date))-(new Date(item.messages[item.messages.length-1].date));}) 
				}
				res.json(result); 
				db.close();
			});
		}); 
	});

//  [ READ - GET ] ROTA: retorna dados de uma conta com base no id
	app.get('/get-user-by-id', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var objectIdUser = new require('mongodb').ObjectID(req.query._id);
			dbo.collection("users").findOne({_id: objectIdUser}, { projection: { password: 0, dt_register: 0, pass_redef: 0} }, function(err, result) {
				if (err) throw err;
				if(result){
					result.age = calcAgeOfUser(result.dt_nasc);
					//result.conversations.sort(function(item, item2){return (new Date(item2.messages[item2.messages.length-1].date))-(new Date(item.messages[item.messages.length-1].date));}) 
				}
				res.json(result); 
				db.close();
			});
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
				db.close();
			});
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
			var latUser = req.query.lat || "???";
			var lngUser = req.query.lng || "???";
			dbo.collection("users").find({_id: {$ne : objectIdUser}}, { projection: { password: 0, dt_register: 0, conversations: 0, pass_redef: 0}}).skip(page).limit(perPage).toArray(function(err, result) {
				if (err) throw err;
				if(result){
					result.forEach(function(item){
						item.age = calcAgeOfUser(item.dt_nasc);
						if(!("location" in item)){
							item.location = {};
							item.location.distance = "???";
						}else{
							item.location.distance = distanceBetweenTwoPoints(item.location.lat, item.location.lng, latUser, lngUser, "K");
							if(!isNaN(item.location.distance)) {
								item.location.distance = item.location.distance.toFixed(1);
							}else{
								item.location.distance = 9999;
							}
						}
					});
					result.sort(compareDistances);
					db.close();
					return res.json(result);
				}
				res.json({oh_no: "oh-no"});
				db.close();
			});
		}); 
	});

//  [ READ - GET ] ROTA: retorna todos os usuários do banco
	app.get('/get-users-reported', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			let perPage = 12;
			let page = req.query.page * perPage;
			var objectIdUser = new require('mongodb').ObjectID(req.query._id);
			var latUser = req.query.lat || "???";
			var lngUser = req.query.lng || "???";
			dbo.collection("users").find({_id: {$ne : objectIdUser}}, { projection: { password: 0, dt_register: 0, conversations: 0, pass_redef: 0}}).skip(page).limit(perPage).toArray(function(err, result) {
				if (err) throw err;
				if(result){
					result.forEach(function(item){
						item.reports ? item.reports : item.reports = [];
						item.age = calcAgeOfUser(item.dt_nasc);
						if(!("location" in item)){
							item.location = {};
							item.location.distance = "???";
						}else{
							item.location.distance = distanceBetweenTwoPoints(item.location.lat, item.location.lng, latUser, lngUser, "K");
							if(!isNaN(item.location.distance)) {
								item.location.distance = item.location.distance.toFixed(1);
							}else{
								item.location.distance = 9999;
							}
						}
					});
					result.sort(compareDistances);
					db.close();
					result = result.filter(function(item){return item.reports.length > 0;});
					console.log(result);
					return res.json(result);
				}
				res.json({oh_no: "oh-no"});
				db.close();
			});
		}); 
	});

	function compareDistances( a, b ) {
		if (a.location.distance < b.location.distance ){
		  return -1;
		}
		if ( a.location.distance > b.location.distance ){
		  return 1;
		}
		return 0;
	  }

	function distanceBetweenTwoPoints(lat1, lon1, lat2, lon2, unit) {
		if ((lat1 == lat2) && (lon1 == lon2)) {
			return 0;
		}
		else {
			var radlat1 = Math.PI * lat1/180;
			var radlat2 = Math.PI * lat2/180;
			var theta = lon1-lon2;
			var radtheta = Math.PI * theta/180;
			var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			if (dist > 1) {
				dist = 1;
			}
			dist = Math.acos(dist);
			dist = dist * 180/Math.PI;
			dist = dist * 60 * 1.1515;
			if (unit=="K") { dist = dist * 1.609344 }
			if (unit=="N") { dist = dist * 0.8684 }
			return dist;
		}
	}

//  [ READ - GET ] ROTA: retorna as conversas de uma conta com base no email
	app.get('/get-user-msgs', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var objectIdUser = new require('mongodb').ObjectID(req.query._id);
			dbo.collection("users").findOne({_id: objectIdUser}, { projection: { conversations: 1} }, function(err, result) {
				if (err) throw err;
				if(result){
					result = result.conversations;
				}
				res.json(result);
				db.close();
			});
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
				db.close();
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza a senha de um usuario
	app.get('/upd-passw', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var objectIdUser = new require('mongodb').ObjectID(req.query._id);
			dbo.collection("users").findOneAndUpdate({ _id: objectIdUser, password: req.query.password }, {$set: {password: req.query.new_pass, pass_redef: false}}, function(err, result) {
				if (err) throw err;
				if(result.value){
					res.json({ok: "ok"}); 
				}else{
					res.json({oh_no: "oh_no"}); 
				}
				db.close();
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza a senha de um usuario sem necessitar senha anterior
	app.get('/upd-passw-w-p', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var objectIdUser = new require('mongodb').ObjectID(req.query._id);
			dbo.collection("users").findOneAndUpdate({ _id: objectIdUser}, {$set: {password: req.query.new_pass, pass_redef: false}}, function(err, result) {
				if (err) throw err;
				if(result.value){
					res.json({ok: "ok"}); 
				}else{
					res.json({oh_no: "oh_no"}); 
				}
				db.close();
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza a senha de um usuario
app.get('/upd-status-acc', urlencodedParser, function (req, res) {
	MongoClient.connect(url, paramsM, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		var objectIdUser = new require('mongodb').ObjectID(req.query._id);
		dbo.collection("users").findOneAndUpdate({ _id: objectIdUser, password: req.query.password}, {$set: {status_account: false}}, function(err, result) {
			if (err) throw err;
			if(result.value){
				res.json({ok: "ok"}); 
			}else{
				res.json({oh_no: "oh_no"}); 
			}
			db.close();
		});
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
				db.close();
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza dados do usuário (estado, se está online ou não)
	app.get('/upd-user-status', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var objectId = new require('mongodb').ObjectID(req.query._id);
			var newStatus = {$set: 	{ online: 1 }};
			dbo.collection("users").updateOne({_id: objectId}, newStatus, {upsert: true}, function(err, result) {
				if (err) throw err;
				res.json({ ok: 'ok' }); 
				db.close();
			});
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
			message.author = req.query._id_from;
			message.date = getTimeServer();

			dbo.collection("users", function(err, collection){
				if (err) throw err;
				collection.updateOne({_id: objectIdUserTo, conversations: {$elemMatch: {_id: req.query._id_from}}}, {$push: {"conversations.$.messages": message}, $inc: {"conversations.$.newmsgs": 1}}, {upsert: true}, function(err, result) {
					if (err) {
						if(err.code == 2){
							collection.updateOne({_id: objectIdUserTo}, {$push: {conversations: {_id: req.query._id_from, messages: [message], newmsgs: 1}}}, {upsert: true}, function(err, result) {
								if (err) throw err;
							});
						}else{
							throw err;
						}
					}
				});
			});
			dbo.collection("users", function(err, collection){
				if (err) throw err;
				collection.updateOne({_id: objectIdUserFrom, conversations: {$elemMatch: {_id: req.query._id_to}}}, {$push: {"conversations.$.messages": message}, $set: {"conversations.$.newmsgs": 0}}, {upsert: true}, function(err, result) {
					if (err) {
						if(err.code == 2){
							collection.updateOne({_id: objectIdUserFrom}, {$push: {conversations: {_id: req.query._id_to, messages: [message], newmsgs: 0}}}, {upsert: true}, function(err, result) {
								if (err) throw err;
								db.close();
							});
						}else{
							throw err;
						}
					}else{
						db.close();
					}
				});
				res.json({ ok: "ok"});

			});

		 }); 
	});

//  [ UPDATE - GET ] ROTA: atualiza status das mensagens (Deixa igual como está no client)
	app.get('/upd-users-status-messages', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var objectIdUserFrom = new require('mongodb').ObjectID(req.query._id_from);

			dbo.collection("users", function(err, collection){
				if (err) throw err;
				collection.find({_id: objectIdUserFrom, conversations: {$elemMatch: {_id: req.query._id_to, newmsgs: {$ne: 0}}}}, {projection: {_id: 0, conversations: 1}}).limit(1).toArray(function(err, result) {
					if (err) throw err;
					if(result.length > 0){
						collection.updateOne({_id: objectIdUserFrom, conversations: {$elemMatch: {_id: req.query._id_to}}}, {$set: {"conversations.$.newmsgs": 0}}, {upsert: true}, function(err, result) {
							if (err) throw err;
							db.close();
						});
					}else{
						db.close();
					}
					res.json({ ok: "ok"});
				});
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza status das mensagens (Deixa igual como está no client)
	// app.get('/upd-users-status-messages', urlencodedParser, function (req, res) {
	// 	MongoClient.connect(url, paramsM, function(err, db) {
	// 		if (err) throw err;
	// 		var dbo = db.db(dbName);
	// 		var objectIdUserFrom = new require('mongodb').ObjectID(req.query._id_from);
	// 		var objectIdUserTo = req.query._id_to;
	// 		var needUpd = true;
	// 		dbo.collection("users").findOne({_id: objectIdUserFrom}, function(err, resultUser) {
	// 			if (err) throw err;
	// 			if(resultUser === "undefined") return res.json({ oh_no: "oh-no"});
	// 			let conversationsLength = resultUser.conversations.length;
	// 			for(let i = 0; i < conversationsLength; ++i){
	// 				if(resultUser.conversations[i]._id == objectIdUserTo){
	// 					if(resultUser.conversations[i].newmsgs == 0){
	// 						needUpd = false;
	// 						break;
	// 					}
	// 					resultUser.conversations[i].newmsgs = 0;
	// 					break;
	// 				}
	// 			}
	// 			if(!needUpd) {
	// 				res.json(resultUser);
	// 				db.close();
	// 			}else{
	// 				dbo.collection("users").updateOne({_id: objectIdUserFrom}, {$set: 	{ conversations: resultUser.conversations }}, function(err, result) {
	// 					if (err) throw err;
	// 					res.json(resultUser);
	// 					db.close();
	// 				});
	// 			}
	// 		});
	// 	}); 
	// });
	

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
				db.close();
			});
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
				db.close();
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza dados do usuário (eventos)
	app.get('/crt-event', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			let dtNow = new Date();
			let event = req.query.evento;
			event.author = req.query._id;
			event.participants = [];
			event.dt_creation = dtNow;
			event.status = 0;
			dbo.collection("events").insertOne(event, function(err, res) {
				if (err) throw err;
				db.close();
			});
			res.send({ok: "ok"});
		}); 
	});

//  [ READ - GET ] ROTA: retorna todos os eventos do banco
	app.get('/get-events', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			dbo.collection("events").find({}, {projection: {dt_creation: 0}}).sort({status: 1, data: 1, horario: 1}).toArray(function(err, result) {
				if (err) throw err;
				if(result) res.json(result);
				db.close();
			});
		}); 
	});

//  [ READ - GET ] ROTA: retorna um evento do banco
	app.get('/get-event', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var eventId = new require('mongodb').ObjectID(req.query._id);
			dbo.collection("events").findOne({_id: eventId}, {projection: {dt_creation: 0}}, function(err, result) {
				if (err) throw err;
				res.json(result); 
				db.close();
			});
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
				db.close();
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: adiciona usuario na lista de participantes de certo evento
	app.get('/set-interest-event', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var eventId = new require('mongodb').ObjectID(req.query._id);
			var newInsert = {$push: 	{ participants: req.query.user_id }};
			dbo.collection("events").findOneAndUpdate({_id: eventId}, newInsert, {upsert: true, returnOriginal: false}, function(err, result) {
				if (err) throw err;
				res.json(result.value); 
				db.close();
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: remove usuario na lista de participantes de certo evento
	app.get('/set-desistence-event', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var eventId = new require('mongodb').ObjectID(req.query._id);
			var newRemove = {$pull: 	{ participants: req.query.user_id }};
			dbo.collection("events").findOneAndUpdate({_id: eventId}, newRemove, {upsert: true, returnOriginal: false}, function(err, result) {
				if (err) throw err;
				res.json(result.value); 
				db.close();
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: seta um evento como cancelado
	app.get('/set-cancel-event', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var eventId = new require('mongodb').ObjectID(req.query._id);
			dbo.collection("events").findOneAndUpdate({_id: eventId}, {$set: {status: 2}}, {upsert: true, returnOriginal: false}, function(err, result) {
				if (err) throw err;
				res.json(result.value); 
				db.close();
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: exclui um evento
	app.get('/del-event', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var eventId = new require('mongodb').ObjectID(req.query._id);
			dbo.collection("events").deleteOne({_id: eventId}, function(err, result) {
				if (err) throw err;
				res.json({ok: "ok"}); 
				db.close();
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza um evento
	app.get('/upd-event', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			let event = req.query.evento;
			var eventId = new require('mongodb').ObjectID(event._id);
			dbo.collection("events").findOneAndUpdate({_id: eventId}, {$set: {title: event.title, data: event.data, horario: event.horario, address: event.address, descricao: event.descricao, tags: event.tags, img: event.img}}, {upsert: true, returnOriginal: false}, function(err, result) {
				if (err) throw err;
				res.json(result.value); 
				db.close();
			});
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
			dbo.collection("users").findOne({email: req.query.email}, function(err, result) {
				if (err) throw err;
				if(result){
					var randPass = () => {
						var result           = '';
						var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@-';
						var charactersLength = characters.length;
						for ( var i = 0; i < 32; i++ ) {
						result += characters.charAt(Math.floor(Math.random() * charactersLength));
						}
						return result;
					};
					var randomPass = randPass();
					let dtNow = new Date();
					dbo.collection("passwords_solicited").insertOne({email: req.query.email, url: randomPass, dt_solicited: dtNow }, function(err, result2) {
						if (err) throw err;
						let returnedInsert = result2.ops[0];
						sendEmailNextSteps(returnedInsert.email, returnedInsert.url, returnedInsert.dt_solicited);
						res.json({ ok: 'ok' }); 
						db.close();
					});
				}else{
					res.json({ oh_no: 'oh-no' }); 
					db.close();
				}
			});
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

//  [ FUNÇÃO ] recebe email como parametro e envia um email de redefinição para ele
	function sendEmailNextSteps(email_to_send, urlText, dt_inserted){
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
				subject: 'Recuperação de conta - Próximos passos', // Subject line
				html: "Você solicitou a recuperação da sua senha da sua conta do aplicativo LeRo. <br> Para prosseguir clique no botão abaixo: <br><br><br><a href='" + nodeHost + "r?t=" + urlText   + "' style='background: #8544bb;padding: 14px;vertical-align: -moz-middle-with-baseline;color: white;font-weight: bolder; text-decoration: none;'>CLIQUE AQUI</a>"
			};
			// send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error);
				}
			});
	}

//  [ READ - GET ] ROTA: retorna um evento do banco
	app.get('/r', urlencodedParser, function (req, res) {
		MongoClient.connect(url, paramsM, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var urlString = req.query.t;
			dbo.collection("passwords_solicited").findOne({url: urlString}, function(err, result) {
				if (err) throw err;
				if(result){
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
					dbo.collection("users").updateOne({email: result.email}, {$set: {password: newPasswordMd5, pass_redef: true}}, function(err, result2) {
						if (err) throw err;
					});
					dbo.collection("users").findOne({email: result.email}, function(err, result3) {
						if (err) throw err;
						if(result3){
							sendEmailRecover(result3.email, newPassword);
							dbo.collection("passwords_solicited").deleteMany({email: result3.email}, function(err, result4) {
								if (err) throw err;
								res.send("Um novo email com sua nova senha foi enviado, verifique sua caixa de mensagens"); 
								db.close();
							});
						}else{
							res.send("Não foi encontrado um usuário com este email"); 
							db.close();
						}
					});
				}else{
					res.send("Senha já redefinida. Verifique sua caixa de mensagens."); 
					db.close();
				}
			});
		}); 
	});


