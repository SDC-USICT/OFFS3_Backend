var con 	   = require("../../models/mysql"),
 	ses        =   require('node-ses'),
 	async      =  require('async'),
 	controller = require("../../models/config");

module.exports = {

	index: function (req, res) {
		con.query('select * from usbas_student_2016 ',function(err,result){
			if(err)
				console.log(err);
			else
				res.send(result);
		});
	},

	initials:function(req,res) {
		//college_name.   //enrollment_number.    //email.     //type   //semester
		//By default email set to sjv97mhjn@gmail.com
		console.log(req.query.college_name + ' ' + req.query.type + ' ' + process.env.year);

		var tablename = req.query.college_name + '_' + req.query.type + '_' + process.env.year;
		var random = Math.floor(Math.random()*(98989 - 12345 + 1) + 12345 );
		var query  = ' update '+ tablename +' set password = ' +random+' where enrollment_no= ?' ;
		con.query(query,[req.query.enrollment_no],function(err,result){
			if(err){
				console.log(err);                     // SQL ERROR
			}
			else if(result.changedRows==0) {
				console.log('No User Found');         // No User Found
				res.json("400");
			}
			else {
					var  client = ses.createClient({key:process.env.key , secret: process.env.secret });
					client.sendEmail({
					    to: req.query.email,
					    from: process.env.email,
					    subject: 'noreply@ffs',
					    message: 'Hi  <br> Please Use this OTP : ' +random ,
					    altText: 'plain text'
					}, function (err1, data, res1) {
					    if(err1) {
					      console.log(err1);
					    } else {
						      // var temp = {
						      // 	tablename : tablename,
						      // 	college_name : req.query.college_name,
						      // 	enrollment_no : req.query.enrollment_no,
						      // 	semester : req.query.semester

						      // }
						      // req.session.temp = temp;
						      // console.log(req.session.temp);
						      res.send("200");

						      }
							 // ...
					});

				}

		})
	},
	verify: function(req,res){

		// var token  = Math.floor(Math.random()*(98989 - 12345 + 1) + 12345 );
		var tablename = req.query.tablename + '_' + process.env.year;
		var enrollment_no = req.query.enrollment_no;
		var password = req.query.password;

		var query = ' select password,name,email,course,stream,enrollment_no,year_of_admission,phone'+
					' from ' + tablename +' where enrollment_no = ' + enrollment_no;
		con.query(query, function(err,result) {
			if(err) {
					console.log(err);
					res.status(400);
			}
			else {
				if(password!=result[0].password)
				{
					console.log("Password Did Not match");
					res.status(400);
				}
				else {

					// var user = {
					//     name  : result[0].name,
					// 	email : result[0].email,
	  		// 			course:result[0].course,
					//    	stream:result[0].stream,
					// 	enrollment_no:result[0].enrollment_no,
	  		// 			year: result[0].year_of_admission,
	  		// 			phone: result[0].phone,
					//     token:token,
					//     semester:req.session.temp.semester
	  		// 		}
			  // 			//console.log(user);
			  // 			req.session.student=user;
			  			//rconsole.log("okay");
			  			//rconsole.log(random.toString());
			  			//res.send(req.session.student);
			  			console.log(result);
			  			var Userinfo = {
			  				enrollment_no: result.enrollment_no,
			  				tablename : tablename
			  			}
			  			res.json(Userinfo);

				}
			}
		})
	},

	dashboard:function(req,res) {
		var enrollment_no = req.query.enrollment_no;
		var tablename = req.query.tablename;

		var query = 'select * from ' + tablename + ' where enrollment_no = ' + enrollment_no;
		con.query(query, function(err, result) {
			if (err) {
				console.log(err);
				return;
			}

			res.json(result);
		})

		// res.json(req.session.user);
	},

	edit:function(req,res){
		var student = {
			phone:req.query.phone
		}

		var tablename = req.session.temp.tablename;
		var query = ' update  ' + tablename + ' set ?'+ ' where enrollment_no = ' + req.session.student.enrollment_no;
		con.query(query,[student],function(err,result){
			if(err){
				console.log(err);
				res.status(400);
			}
			else
				res.status(200);
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
	feedbackform:function(req,res){
		var college_name = req.session.temp.college_name;
		var tablename = college_name + '_batch_allocation';
		var tablename2 =  college_name + '_subject_allocation';
		var query = 'select * from ' +tablename2+' as s inner join ' + tablename +
					' as b on s.batch_id = b.batch_id where b.course=? and b.stream = ? and b.semester = ?  '
		con.query(query,[req.session.student.course,req.session.student.stream,req.session.student.semester.toString()],function(err,result){
			if(err) {
				console.log(err);
				res.status(400);
			}
			else {
				res.json(result)
			}
		})

	},

	feedback:function(req,res) {
		var tablename = req.session.temp.college_name + '_feedback_' + process.env.year;
		//tablename = 'usbas_feedback_2016';
		console.log(tablename);
		var feedbacks = req.body;
		console.log(feedbacks);

 		async.each(feedbacks,function(feedback,callback) {
		console.log(feedback);
		var query='update '+ tablename+' set'+
				   ' at_1 = concat(at_1,?),  at_2 = concat(at_2,?),  at_3 = concat(at_3,?), '  +
				   ' at_4 = concat(at_4,?),  at_5 = concat(at_5,?),  at_6 = concat(at_6,?), '  +
				   ' at_7 = concat(at_7,?),  at_8 = concat(at_8,?),  at_9 = concat(at_9,?), '  +
				   ' at_10 = concat(at_10,?),at_11 = concat(at_11,?),at_12 = concat(at_12,?), '+
				   ' at_13 = concat(at_13,?),at_14 = concat(at_14,?),at_15 = concat(at_15,?) ,'+
				   ' no_of_students_evaluated =  no_of_students_evaluated + 1 ,'+
				   ' total = total + ? ' +
		          'where feedback_id = ' +feedback.fid;
		var result = feedback.result;
		var sum=0;
		for(i=0;i<15;i++)
		{
			sum=sum +Number(result[i]);
		}

		con.query(query,[result[0],result[1],result[2],result[3],result[4],result[5],result[6],result[7],result[8],result[9],result[10],result[11],result[12],result[13],result[14],sum],function(err,result){
			if(err)
				console.log(err);
			else
				console.log(result);
		})

		callback();
		}, function(err) {
			if (err){
				console.error(err);
				res.status(err);
			}
			console.log("OKay");
			res.status(200)
		})


	}





 }
