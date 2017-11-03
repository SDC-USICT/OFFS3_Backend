var express 		= require('express'),
	app				= express(),
	bodyparser 		= require('body-parser'),
	bcrypt			= require('bcrypt-nodejs'),
	session			= require('express-session'),
	sessionStore      =   new session.MemoryStore(),
	request			= require('request'),
	methodOverride  = require('method-override'),
	sql				= require("mssql"),
	con             = require("./models/mysql"),
	routes 			= require('./routes/route'),
	controller		= require("./models/config");
					   require('dotenv').config();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended :true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(session({
		    secret: 'secret',
    		resave: true,
    		saveUninitialized: true,
    		store: sessionStore,  
    		cookie:{
    		},
    		rolling: true,
    		unset: 'destroy' 
  }));

app.set("view engine", "ejs");
app.use("/", routes);


//middleware
var isauthenticated = function(req,res,next){
	
}

app.listen(process.env.port,function(){
	console.log("Listening On port " + process.env.port);
})


//SQL LOCK TRANSACTION , CHECK IF INTERNALLY PRESENT.
//DATA PORTAL ERRORS @ ENTERING
//TRIAL DATE 09/11