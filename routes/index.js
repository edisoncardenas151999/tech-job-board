const Job = require('../models/Job.model.js');

const router= require('express').Router()


/* GET home page */

router.get("/", (req, res, next) => {

  Job.find({}).limit(2)
  .then((jobsFromDb) => {
    res.render('index', {jobs:jobsFromDb});
  })
})


router.get("/", (req, res, next) => {
  res.render("index", {user: req.session.user, title:"Tech Job Board"});
});

module.exports = router;
