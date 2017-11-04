var express = require("express");
var router  = express.Router();
var routes = {
  views: {
    index: require("./views/index")
  }
}

var isauthenticated = function(req,res,next){
	if(req.session.student&&req.session.student.token==req.headers.token){
		console.log("++++++Authenticated+++++++");
			next();
	}
	else
	{
		console.log("Not Authenticated");
		res.send("Not Authenticated");
	}
}

router.get("/", routes.views.index.index);
router.post("/initials", routes.views.index.initials);
router.post("/verify",routes.views.index.verify);
router.post("/dashboard",isauthenticated,routes.views.index.dashboard);
router.post("/edit",isauthenticated,routes.views.index.edit);
router.get("/feedbackform",isauthenticated,routes.views.index.feedbackform);
router.post("/feedback",routes.views.index.feedback);

module.exports = router;
