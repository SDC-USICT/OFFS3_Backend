var connection=require('express-myconnection');
var mysql=require('mysql');


var con=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"sdc"
});
//Z3apbUnvi5LQKClu
con.connect(function(err){
  if(err)
    throw err;
  console.log("Connected");

});
module.exports= con;
