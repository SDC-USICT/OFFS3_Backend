// var connection=require('express-myconnection');
// var mysql=require('mysql');

// var con=mysql.createConnection({
//   host:"myshop.ctikxe6frwwu.ap-south-1.rds.amazonaws.com",
//   user:"myshop",
//   password:"aXpw5GPjJPCbyUzb",
//   database:'sdc'
// });
// //Z3apbUnvi5LQKClu
// con.connect(function(err){
//   if(err)`
//     throw err;
//   console.log("Connected");

// });
// module.exports= con;


// update usmc_feedback_2017
// set at_1='0' ,at_2='0', at_3='0', at_4='0', at_5='0', at_6='0', at_7='0', at_8='0', at_9='0', at_10='0', at_11='0', at_12='0', at_13='0', at_14='0', at_15='0'
var connection=require('express-myconnection');
var mysql=require('mysql');

var con=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:'sdc'
});
//Z3apbUnvi5LQKClu
con.connect(function(err){
  if(err)
    throw err;
  console.log("Connected");

});
module.exports= con;

