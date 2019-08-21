const express = require('express');
const jwt = require('jsonwebtoken');
global.jwt = jwt;
const app = express();
//Before npm install --save morgan : Tutorial->Handling Errors & Improving the Project Setup | Creating a REST API with Node.js
const morgan = require('morgan');
//npm install --save body-parser -> for getting all post element or json data

const bodyParser = require('body-parser');
const mysql = require("mysql");

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const key = "s&creth@it!";
global.key = key;

//Database connection createPool
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'haititraficDb'
});
// connect to database
db.connect((err) => {
    if (err) {
    	console.error('error connecting: ' + err.stack);
        throw err;
    }
    console.log('connected as id ' + db.threadId);
    console.log('Connected to database');
});

global.db = db;

//handle CORS origin error
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);

	if(req.method === "OPTIONS"){
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

//FORMAT OF TOKEN
//Authorization: Bearer <access_token>
//verify token
global.tokenvalidate = function tokenvalidate(req, res, next){
	//Get auth header value
	const bearerHeader = req.headers['authorization'];
	//check if bearer is undefined
	if(typeof bearerHeader !== 'undefined'){
		//split at the space
		const bearer = bearerHeader.split(' ');
		//get token from array
		const bearerToken = bearer[1];
		req.token = bearerToken;
		//call next middleware
		next();
	}else{
		//Forbiden
		res.sendStatus(403);
	}
}

const loginRoutes = require('./api/routes/login');
const registerRoutes = require('./api/routes/register');
const usertypeRoutes = require('./api/routes/usertype');
const categoryAlertRoutes = require('./api/routes/alert-category');
const levelAlertRoutes = require('./api/routes/alert-level');
const statusAlertRoutes = require('./api/routes/alert-status');
const typeAlertRoutes = require('./api/routes/alert-type');
const communeRoutes = require('./api/routes/commune');
const departmentRoutes = require('./api/routes/department');
const reactionRoutes = require('./api/routes/reaction');
const alertRoutes = require('./api/routes/alert');

//Routes which should handle request
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/usertype', usertypeRoutes);
app.use('/category', categoryAlertRoutes);
app.use('/level', levelAlertRoutes);
app.use('/statut', statusAlertRoutes);
app.use('/type', typeAlertRoutes);
app.use('/commune', communeRoutes);
app.use('/department', departmentRoutes);
app.use('/reaction', reactionRoutes);
app.use('/alert', alertRoutes);

//handle error
app.use((req, res, next) => {
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});

//handle error
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error:{
			message : error.message
		}
	});
});
// app.use((req, res, next) => {
// 	res.status(200).json({
// 		message: 'It works!'
// 	});
// });
module.exports = app;


