var con = require("../../models/mysql")
module.exports = {

	index: function (req, res) {

		res.render("index");
	},
	verify:function(req,res){
		//college name.   //Enrollment Number.    //Email Id.     //type
		

		var tablename = req.query.college_name + '_' + req.query.type + '_' + controller.year;
		var query     = ' select name from ' + tablename + ' where enrollment_no = ? ' ;
		
		con.query(query,[req.query.enrollment_no],function(err,result){
			if(err)
				res.send(err);                     // SQL ERROR
			else if(result[0]==null)
				res.send('No Data Found');         // No User Found
			else
				res.send(req.query.email);         // Email sending using amazon sns


		})
	}
}
