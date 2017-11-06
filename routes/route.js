var express = require("express");
var router  = express.Router();
var routes = {
  views: {
    index: require("./views/index")
  }
}

// var isauthenticated = function(req,res,next){
// 	if(req.session.student&&req.session.student.token==req.headers.token) {
// 		console.log("++++++Authenticated+++++++");
// 			next();
// 	}
// 	else
// 	{
// 		console.log("Not Authenticated");
// 		res.send("Not Authenticated");
// 	}

// }




	/*v
	jisko user feedback dena chahta hai uski feedback id  he bhejni hai apne backend mei
	*/
router.get("/", routes.views.index.index);
router.post("/initials", routes.views.index.initials);
router.post("/verify", routes.views.index.verify);
router.get("/dashboard", routes.views.index.dashboard);
router.post("/edit", routes.views.index.edit);
router.get("/feedbackform", routes.views.index.feedbackform);
router.post("/feedback", routes.views.index.feedback);

module.exports = router;
