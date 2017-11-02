var express = require("express");
var router  = express.Router();

var routes = {
  views: {
    index: require("./views/index")
  }
}

router.get("/", routes.views.index.index);

// router.get("/login",routes.views.index.login);
// router.get("/store", routes.views.index.store);
// router.get("/list", routes.views.index.list);
// router.get("/view.html", routes.views.index.viewstatic);

// //Prescription List:
// router.get("/prescription/:id", routes.views.index.prescription);
// router.get("/report/:id", routes.views.index.report);
// router.get("/prescriptionone/:id1/:id2", routes.views.index.prescriptionone);

// //Add Prescrription
// router.get("/addprescription/:id", routes.views.index.addprescription);
// router.post("/addprescription/:id", routes.views.index.Addprescription);
// router.get("/addreport/:id", routes.views.index.addreport);
// router.post("/addreport/:id",routes.views.index.Addreport);

// //Verify Image
// router.get("/verify", routes.views.index.verify);
// router.post("/verify", upload.any(), routes.views.index.verifyPost);

// router.get("/welcome", routes.views.index.welcome);
// router.get("/loginsignup", routes.views.index.loginsignup);
// router.get("/reports", routes.views.index.reports);

module.exports = router;
