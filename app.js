/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// create a new express server
var app = express();

var bodyParser = require('body-parser');  
var urlencodedParser = bodyParser.urlencoded({ extended: false })  

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8080;

// start server on the specified port and binding host
app.listen(port, '0.0.0.0', function() {
	console.log("PORTA: "+port);
});

var mongo = require('mongodb'); 

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://teste:teste123@mongo-t-qnccn.gcp.mongodb.net/test?retryWrites=true&w=majority";

app.post('/connect-user', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("users").findOne({email: req.body.email, password: req.body.password}, function(err, result) {
    if (err) throw err;
	if(result != null){
		res.json(result); 
	}else{
		res.json(result); 
	}
    db.close();
  });
}); 
});

// Verificar se usuário ja existe
app.post('/user-exists', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("users").findOne({email: req.body.email}, function(err, result) {
    if (err) throw err;
	if(result != null){
		res.json({ ok: 'ok' }); 
	}else{
		res.json(result); 
	}
    db.close();
  });
}); 
});

app.post('/create-user', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = {name: req.body.name, email: req.body.email, password: req.body.password};
  dbo.collection("users").insertOne(myobj, function(err, res) {
    if (err) throw err;
    db.close();
  });
}); 
res.send("");
});

app.post('/get-info-user', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("users").findOne({email: req.body.email}, { projection: { _id: 0, name: 1, email: 1 } }, function(err, result) {
    if (err) throw err;
	if(result != null){
		res.json(result); 
	}else{
		res.json(result); 
	}
    db.close();
  });
}); 
});

app.post('/get-all-users', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("users").find({}).toArray(function(err, result) {
    if (err) throw err;
    res.json(result);
    db.close();
  });
}); 
});




// Verificar se usuário ja existe
app.post('/send-email-recover', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("users").findOne({email: req.body.email}, function(err, result) {
    if (err) throw err;
	if(result != null){
		sendEmailRecover(result.email);
		res.json({ ok: 'ok' }); 
	}else{
		res.json(result); 
	}
    db.close();
  });
}); 
});


// ENVIO DE E-MAILS COM NODEMAILER
const nodemailer = require('nodemailer');

function sendEmailRecover(email_to_send){
	
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
			html: '<b>Hello world?</b> TESTE do NODEMAILER' // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
		});



	
}









/*


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

// @route POST /upload
// @desc  Uploads file to DB
app.post('/upload', upload.single('file'), (req, res) => {
   //res.json({ file: req.file });
   res.redirect('main-view.html');  
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



*/
