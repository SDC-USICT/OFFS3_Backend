var con 	   = require("../../models/mysql"),
 	ses        =   require('node-ses'),
 	async      =  require('async'),
 	controller = require("../../models/config"),
     nodemailer = require('nodemailer');

module.exports = {

	index: function (req, res) {

},
	initials:function(req,res) {
		//college_name.   //enrollment_number.    //email.     //type   //semester
		//By default email set to sjv97mhjn@gmail.com

console.log("Hit initials");
console.log(req.query);
if(req.query.college_name==null||req.query.enrollment_no==null||req.query.email==null||req.query.type==null)
	{  console.log("Not all Fields Set");
		res.send("400");          }
			else
		{       var year = (req.query.enrollment_no.substr(req.query.enrollment_no.length-2,2));
				year = '20' + year.toString();

				console.log(req.query.enrollment_no.substr(10,12));
				console.log(req.query);
				var tablename = req.query.college_name + '_' + req.query.type + '_' + year;
				console.log(tablename);
				var random = Math.floor(Math.random()*(98989 - 12345 + 1) + 12345 );
				var query  = ' update '+ tablename +' set password = ' +random.toString() +
							 ', email= ? ' +
							 ' where enrollment_no= ?' ;
				con.query(query,[req.query.email.toString(),Number(req.query.enrollment_no)],function(err,result){
					if(err){
						console.log(err);
						res.send("400");                      // SQL ERROR
					}
					else if(result.changedRows==0) {
						console.log('No User Found');         // No User Found
						res.json("400");
					}
					else {


							nodemailer.createTestAccount((err, account) => {
							var transporter = nodemailer.createTransport({
							  service: 'gmail',
							  auth: {
							    user:process.env.email,
							    pass: process.env.password,
							  }
							});

							var mailOptions = {
							  from: process.env.email,
							  to: req.query.email,
							  subject: 'Noreply@ffs',
							  text: 'Hi, Please Use this OTP : ' +random
							};

							transporter.sendMail(mailOptions, function(error, info){
							  if (error) {
							    console.log(error);
							  } else {
							    console.log('Email sent: ' + info.response);

							    res.send("200");
							  }
							});

							});



						}

				})}
	},
	verify: function(req,res){
		// var token  = Math.floor(Math.random()*(98989 - 12345 + 1) + 12345 );
		console.log("Hit verify");
		console.log(req.query);
		if(req.query.tablename==null||req.query.enrollment_no==null||req.query.password==null)
		{
			console.log("Not all fields set");
			res.send("400");
				}
		else
		{
		var year = (req.query.enrollment_no.substr(req.query.enrollment_no.length-2,2));
		year = '20' + year.toString();
		var tablename = req.query.tablename + '_' + year;
		console.log(tablename);
		var enrollment_no = Number(req.query.enrollment_no);
		console.log(enrollment_no);
		var password = req.query.password;
		console.log(password);
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
			  			console.log(result[0]);
			  			var Userinfo = {
			  			enrollment_no: result[0].enrollment_no,
			  			tablename : tablename
			  			}
			  			console.log(Userinfo);
			  			res.json(Userinfo);

				}
			}
		}) }
	},

dashboard:function(req,res) {

		if(req.query.tablename==null||req.query.enrollment_no==null)
		{
			console.log("Not all fields set");
			res.send("400");
				}
		else
		{
		var enrollment_no = Number(req.query.enrollment_no);
		var tablename = req.query.tablename;
		var query = 'select * from ' + tablename + ' where enrollment_no = ' + enrollment_no;
		con.query(query, function(err, result) {
			if (err) {
				console.log(err);
				return;
			}

			res.json(result);
		})
			}
		// res.json(req.session.user);
	},

	edit:function(req,res){

		var phone=req.query.phone;
		var tablename = req.query.tablename;
		if(tablename&&phone){
		var query = ' update  ' + tablename + ' set phone=?'+ ' where enrollment_no = ' + req.query.enrollment_no;
    	console.log(query);
    	con.query(query,[phone],function(err,result){
			if(err){
						console.log(err);
						res.status(400);
					}
			else
						{  console.log(result);
							res.send("200");}
				}) }
			else
				{
					console.log("Not all data set");
					res.send("400");
				}
	 },

	feedbackform:function(req,res) {
		//console.log();

		if(req.query.course&&req.query.stream&&req.query.semester&&req.query.college_name)
		{
			    console.log(req.query.course, req.query.stream, req.query.semester,req.query.college_name);
				var college_name 	= req.query.college_name;

				var tablename1 		= college_name + '_subject_allocation' ;
				var tablename2 		= college_name + '_batch_allocation';
				var tablename3 		= 'employee';
				var student = {
					course	: 	req.query.course,
					stream	: 	req.query.stream,
					semester: 	Number(req.query.semester)
				};
				if(process.env.year=='2017')
				var tablename1 		= college_name + '_subject_allocation_' + process.env.year ;
				var query = ' select s.feedback_id,s.batch_id,s.subject_code,s.instructor_code, ' +
				            ' s.subject_name,s.type,b.course,b.stream,b.semester,t.name as teacher '+
							' from ' 	   + tablename1 + ' as s ' +
							' inner join ' + tablename2 + ' as b on s.batch_id = b.batch_id ' +
							' inner join ' + tablename3 + ' as t on t.instructor_id = s.instructor_code ' +
							' where b.course=? and b.stream =? and b.semester = ?'
							console.log(query);
				con.query(query,[student.course,student.stream,student.semester],function(err,result) {
					if(err) {
						console.log(err);
						res.status(400);
					}
					else {
						console.log(result);
						res.json(result)
					}
				})
		}
		else
		{
			console.log("Not all fields set");
			res.send("400");
		}

	},

	feedback:function(req,res) {

		//res.send(req.body);
		console.log(req.body);
		var tablename = req.body.college_name + '_feedback_' + process.env.year;
		var feedbacks = req.body.teacherFeedback;


		if(tablename==null||feedbacks==null){
			console.log("Not All Fields set");
			res.send("400");
		}
		else
		{

			 		var error=0;
			 		async.each(feedbacks,function(feedback,callback) {
					console.log(feedback);
					var result = feedback.score;
					if(result.length==15&&feedback.feedbackId!=null)
						{
							var query='update '+ tablename+' set'+
							   ' at_1 = concat(at_1,?),  at_2 = concat(at_2,?),  at_3 = concat(at_3,?), '  +
							   ' at_4 = concat(at_4,?),  at_5 = concat(at_5,?),  at_6 = concat(at_6,?), '  +
							   ' at_7 = concat(at_7,?),  at_8 = concat(at_8,?),  at_9 = concat(at_9,?), '  +
							   ' at_10 = concat(at_10,?),at_11 = concat(at_11,?),at_12 = concat(at_12,?), '+
							   ' at_13 = concat(at_13,?),at_14 = concat(at_14,?),at_15 = concat(at_15,?) ,'+
							   ' no_of_students_evaluated =  no_of_students_evaluated + 1 ,'+
							   ' total = total + ? ' +
					          'where feedback_id = ' +feedback.feedbackId;
					var sum=0;
					for(i=0;i<=14;i++)    //check;
					{   result[i]=Number(result[i]);
						if(result[i]>5&&result[i]<1)
						{	console.log("Incorrect Data");
							res.send("400");
						}else{
						sum=sum+Number(result[i]);
													}
					};
					con.query(query,[result[0],result[1],result[2],result[3],result[4],result[5],result[6],result[7],result[8],result[9],result[10],result[11],result[12],result[13],result[14],sum],function(err,Result){
						if(err)
							console.log(err);
						else{
							console.log("feedback id " +feedback.feedbackId + ' of length '+ result.length +' updated ')

						}
					})


						}
						else if(result.length==8&&feedback.feedbackId!=null)
						{
							var query='update '+ tablename+' set'+
							   ' at_1 = concat(at_1,?),  at_2 = concat(at_2,?),  at_3 = concat(at_3,?), '  +
							   ' at_4 = concat(at_4,?),  at_5 = concat(at_5,?),  at_6 = concat(at_6,?), '  +
							   ' at_7 = concat(at_7,?),  at_8 = concat(at_8,?), '+
							   ' no_of_students_evaluated =  no_of_students_evaluated + 1 ,'+
							   ' total = total + ? ' +
					          'where feedback_id = ' +feedback.feedbackId;
					var sum=0;
					for(i=0;i<=7;i++)    //check;
					{   result[i]=Number(result[i]);
						if(result[i]>5&&result[i]<1)
						{
							res.send("Incorrect Data");
						}else{

						sum=sum+Number(result[i]);
										}
					};

					con.query(query,[result[0],result[1],result[2],result[3],result[4],result[5],result[6],result[7],sum],function(err,Result){
						if(err)
							console.log(err);
						else{
						  console.log("feedback id " +feedback.feedbackId + ' of length ' + result.length + ' updated ')

						}
					})
						}
						else{
							console.log("Error at processing feedback of id : " + feedback.feedbackId  + ' of length ' + result.length );
							error=1;
						}

					callback();
					}, function(err) {
						 if (err){
							console.error(err);
							res.status(err);
						}
						else{
							   nodemailer.createTestAccount((err, account) => {
								var transporter = nodemailer.createTransport({
								  service: 'gmail',
								  auth: {
								    user: process.env.email,
								    pass: process.env.password,
								  }
								});

								var mailOptions = {
								  from: process.env.email,
								  to: req.body.email,   //Require user email at last as well
								  subject: 'Noreply@ffs',
								  text: 'Thank You For Your feedback. Your feedback has been recorded .'
								};

								transporter.sendMail(mailOptions, function(error, info){
								  if (error) {
								    console.log(error);
								    res.send("400")
								  } else {
								    console.log('Email sent: ' + info.response);
								    res.send("200");
								  }
								});

								});
						}

					})

			}
	}

 }
