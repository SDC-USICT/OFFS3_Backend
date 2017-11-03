var con 	   = require("../../models/mysql"),
 	ses        =   require('node-ses'),
 	controller = require("../../models/config");

module.exports = {

	index: function (req, res) {

		res.send("Home Page");
	},
	initials:function(req,res) {
		//college_name.   //enrollment_number.    //email.     //type   //semester
		//By default email set to sjv97mhjn@gmail.com
		var tablename = req.query.college_name + '_' + req.query.type + '_' + process.env.year;
		var random = Math.floor(Math.random()*(98989 - 12345 + 1) + 12345 ); 
		var query  = ' update '+ tablename +' set password = ' +random+' where enrollment_no= ?' ;
		con.query(query,[req.query.enrollment_no],function(err,result){
			if(err)
				console.log(err);                     // SQL ERROR
			else if(result.changedRows==0)
				console.log('No User Found');         // No User Found
			else                                      // Email sending using amazon sns
				{     console.log(result);
					  var  client      =   ses.createClient({key:process.env.key , secret: process.env.secret });
					  
					  client.sendEmail({
										    to: req.query.email, 
										    from: process.env.email,
										    subject: 'noreply@ffs', 
										    message: 'Hi  <br> Please Use this OTP : ' +random , 
										    altText: 'plain text'
										  }, function (err1, data, res1) {
												    if(err1)
													    {
													      console.log(err1);
													    }
												    else
													      {
													      var temp = {
													      	tablename : tablename,
													      	college_name : req.query.college_name,
													      	enrollment_no : req.query.enrollment_no,
													      	semester : req.query.semester
													      
													      }
													      req.session.temp = temp;
													      console.log(req.session.temp);
													      res.send(random.toString());

													      }
												 // ... 
										});

				}    


		})
	},
	verify: function(req,res){
		
		var token  = Math.floor(Math.random()*(98989 - 12345 + 1) + 12345 ); 
		var tablename = req.session.temp.tablename;
		var query = ' select password,name,email,course,stream,enrollment_no,year_of_admission,phone'+
					' from ' + tablename +' where enrollment_no = ' + req.session.temp.enrollment_no;
		con.query(query,function(err,result){
			if(err)
				console.log(err);
			else
			{
				if(req.query.password!=result[0].password)
				{
					console.log("Password Did Not Match");
				}
				else{		
						  
		
							var user = {
													    name  : result[0].name,
														email : result[0].email,
								      					course:result[0].course,
													   	stream:result[0].stream,
														enrollment_no:result[0].enrollment_no,
								      					year: result[0].year_of_admission,
								      					phone: result[0].phone,
													    token:token,
													    semester:req.session.temp.semester
													      				}
													      			//console.log(user);
													      			req.session.student=user;
													      			//rconsole.log("okay");                                                                             
													      			//rconsole.log(random.toString());	
													      			res.send(req.session.student);




					}
			}
		})



	},
	edit:function(req,res){
		var student = {
			phone:req.query.phone,
			email:req.query.email
		}

		var tablename = req.session.temp.tablename;
		var query = ' update  ' + tablename + ' set ?'+ ' where enrollment_no = ' + req.session.student.enrollment_no;
		con.query(query,[student],function(err,result){
			if(err)
				console.log(err);
			else
				res.send(result);
		})
	 },
	// feedback:function(req,res){
	// 	var college_name = req.session.temp.college_name;
	// 	var tablename = college_name + '_batch_allocation';
	// 	var query = 'select batch_id from ' + tablename +' where course=? and stream = ? and semester = ? ';
	// 	con.query(query,[req.session.student.course,req.session.student.stream,req.session.student.semester.toString()],function(err,result){
	// 		if(err)
	// 			console.log(err);
	// 		else
	// 			{  	var tablename2 =  req.session.temp.college_name + '_subject_allocation';
	// 				var query2 = 'select * from ' + tablename2 + ' where batch_id = ' +result[0].batch_id;
	// 				con.query(query2,function(err2,result2){
	// 					if(err2)
	// 						console.log(err2);
	// 					else
	// 						res.send(result2);
	// 				})

	// 					}
	// 	})


	// },

//select * 
//from usbas_subject_allocation as s 
//inner JOIN usbas_batch_allocation as b
//on s.batch_id = b.batch_id 
//where b.semester = 1 
	feedback:function(req,res){
		var college_name = req.session.temp.college_name;
		var tablename = college_name + '_batch_allocation';
		var tablename2 =  college_name + '_subject_allocation';				
		var query = 'select * from ' +tablename2+' as s inner join ' + tablename +
					' as b on s.batch_id = b.batch_id where b.course=? and b.stream = ? and b.semester = ?  ' 
		con.query(query,[req.session.student.course,req.session.student.stream,req.session.student.semester.toString()],function(err,result){
			if(err)
				console.log(err);
			else
				res.send(result)
		})

	}





}

													      	// con.query(query1,[req.query.enrollment_no],function(err2,result2){
													      	// 	if(err2)
													      	// 		console.log(err2);
													      	// 	else
													      	// 		{

													      	// 			
													      	// 		}

													      	// })