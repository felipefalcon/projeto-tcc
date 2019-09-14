//  -----------------------------------------------------------------------------------------------------------------------
//	CONFIGURAÇÃO DO SERVIDOR NODE
//	-----------------------------------------------------------------------------------------------------------------------
	var express = require('express');

	var app = express();

	var bodyParser = require('body-parser');  
	var urlencodedParser = bodyParser.urlencoded({ extended: false })  

	app.use(express.static(__dirname + '/public'));

	var port = process.env.PORT || 8080;

	app.listen(port, '0.0.0.0', function() {
		console.log("PORTA: "+port);
	});
	
//  ------------------------------------------------------------------------------------------------------------------------
//	CONFIGURAÇÃO DO MÓDULO DO MONGODB
//	------------------------------------------------------------------------------------------------------------------------
	var mongo = require('mongodb'); 
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb+srv://teste:teste123@mongo-t-qnccn.gcp.mongodb.net/test?retryWrites=true&w=majority";
	
//  ------------------------------------------------------------------------------------------------------------------------
//	ROTAS
//	------------------------------------------------------------------------------------------------------------------------
//	ROTAS [USUÁRIO]
//	------------------------------------------------------------------------------------------------------------------------
//  [ CREATE - POST ] ROTA: insere no banco um novo usuário
	app.post('/crt-user', urlencodedParser, function (req, res) {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
			var myobj = {	name: req.body.name, 
							email: req.body.email, 
							password: req.body.password, 
							pics_ids: {main_pic: "", sec_pic1: "", sec_pic2: "", sec_pic3: ""}
						};
			dbo.collection("users").insertOne(myobj, function(err, res) {
				if (err) throw err;
				db.close();
			});
		}); 
		res.send("");
	});
	
//  [ READ - POST ] ROTA: verifica se o email e senha correspondem a uma conta
	app.post('/con-user', urlencodedParser, function (req, res) {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
			dbo.collection("users").findOne({email: req.body.email, password: req.body.password}, { projection: { _id: 0, password: 0} }, function(err, result) {
				if (err) throw err;
				res.json(result); 
				db.close();
			});
		}); 
	});

//  [ READ - GET ] ROTA: retorna dados de uma conta com base no email
	app.get('/get-user', urlencodedParser, function (req, res) {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
			dbo.collection("users").findOne({email: req.query.email}, { projection: { _id: 0, password: 0} }, function(err, result) {
				if (err) throw err;
				res.json(result); 
				db.close();
			});
		}); 
	});
	
//  [ READ - GET ] ROTA: retorna todos os usuários do banco
	app.get('/get-users', urlencodedParser, function (req, res) {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
			dbo.collection("users").find({}).toArray(function(err, result) {
				if (err) throw err;
				if(result){
					return res.json(result);
				}
				res.json({oh_no: "oh-no"});
				db.close();
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza a foto principal do usuário
	app.get('/upd-user-main-pic', urlencodedParser, function (req, res) {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
			var myquery = {email: req.query.email};
			var newvalues = {$set: { "pics_ids.main_pic": req.query.pic_id}};
			dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
				if (err) throw err;
				res.json({ ok: 'ok' }); 
				db.close();
			});
		}); 
	});

//  [ UPDATE - GET ] ROTA: atualiza dados do usuário (idade, trabalho, etc)
	app.get('/upd-user-profile', urlencodedParser, function (req, res) {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
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
				db.close();
			});
		}); 
	});

//  [ DELETE - GET ] ROTA: atualiza dados do usuário (idade, trabalho, etc)
	app.get('/del-user', urlencodedParser, function (req, res) {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
			dbo.collection("users").deleteOne({email: req.query.email}, function(err, result) {
				if (err) throw err;
				res.json(result);
				db.close();
			});
		}); 
	});

//  ------------------------------------------------------------------------------------------------------------------------
//	CONFIGURAÇÃO DO MÓDULO NODEMAILER
//	------------------------------------------------------------------------------------------------------------------------
	const nodemailer = require('nodemailer');
	
//  [ READ - GET ] ROTA: verifica se o email informado para recuperação existe no banco e em seguida envia o email de rec.
	app.get('/send-email-recover', urlencodedParser, function (req, res) {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
			dbo.collection("users").findOne({email: req.query.email}, function(err, result) {
				if (err) throw err;
				if(result != null){
					sendEmailRecover(result.email, result.password);
					res.json({ ok: 'ok' }); 
				}else{
					res.json(result); 
				}
				db.close();
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




// Não Indentei daqui pra baixo





	const path = require('path');
	const crypto = require('crypto');
	const mongoose = require('mongoose');
	const multer = require('multer');
	const GridFsStorage = require('multer-gridfs-storage');
	const Grid = require('gridfs-stream');
	const methodOverride = require('method-override');

	app.use(methodOverride('_method'));

	const conn = mongoose.createConnection(url);

	// Init gfs
	var gfs;

	conn.once('open', () => {
	  // Init stream
	  gfs = Grid(conn.db, mongoose.mongo);
	  gfs.collection('test');
	});

	// Create storage engine
	const storage = new GridFsStorage({
	  url: url,
	  file: (req, file) => {
		return new Promise((resolve, reject) => {
		  crypto.randomBytes(16, (err, buf) => {
			if (err) {
			  return reject(err);
			}
			const filename = buf.toString('hex') + path.extname(file.originalname);
			const fileInfo = {
			  filename: filename,
			  bucketName: 'test'
			};
			resolve(fileInfo);
		  });
		});
	  }
	});
	const upload = multer({ storage });


	app.post('/upload', upload.single('file'), (req, res) => {
	   //res.json({ file: req.file });
	   //console.log(req.file);
	   res.json(req.file.id);
	});


	app.get('/get-img', urlencodedParser, function (req, res) {
	  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("test");
		  dbo.collection("test.files").findOne({_id: new mongo.ObjectID(req.query._id)}, function(err, result) {
			if (err) throw err;
			if(result){
				return res.json(result); 
			}
			res.json({oh_no: "oh-no"}); 
			db.close();
		  });
		}); 
	});







	// @route GET /files
	// @desc  Display all files in JSON
	app.get('/files', (req, res) => {
	  gfs.files.find().toArray((err, files) => {
		// Check if files
		if (!files || files.length === 0) {
		  return res.status(404).json({
			err: 'No files exist'
		  });
		}

		// Files exist
		return res.json(files);
	  });
	});

	// @route GET /files/:filename
	// @desc  Display single file object
	app.get('/files/:filename', (req, res) => {
	  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		// Check if file
		if (!file || file.length === 0) {
		  return res.status(404).json({
			err: 'No file exists'
		  });
		}
		// File exists
		return res.json(file);
	  });
	});

	// @route GET /image/:filename
	// @desc Display Image
	app.get('/image/:filename', (req, res) => {
	  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		// Check if file
		if (!file || file.length === 0) {
		  return res.status(404).json({
			err: 'No file exists'
		  });
		}

		// Check if image
		if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
		  // Read output to browser
		  const readstream = gfs.createReadStream(file.filename);
		  readstream.pipe(res);
		} else {
		  res.status(404).json({
			err: 'Not an image'
		  });
		}
	  });
	});

	// @route DELETE /files/:id
	// @desc  Delete file
	app.delete('/files/:id', (req, res) => {
	  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
		if (err) {
		  return res.status(404).json({ err: err });
		}

		res.redirect('/');
	  });
	});




