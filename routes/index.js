const router= require('express').Router()


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {user: req.session.user, title:"Tech Job Board"});
});

module.exports = router;
