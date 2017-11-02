var express 		= require('express'),
	app				= express(),
	bodyparser 		= require('body-parser'),
	bcrypt			= require('bcrypt-nodejs'),
	session			= require('express-session'),
	request			= require('request'),
	methodOverride  = require('method-override'),
	port 			= 3000,
	sql				= require("mssql"),

	routes 			= require('./routes/route')



app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended :true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");


 app.use("/", routes);

// app.get("/", function(req, res) {
// 	var config  = {

// 	}
// })



app.listen(port,function(){
	console.log("Listening On port " + port);
})
