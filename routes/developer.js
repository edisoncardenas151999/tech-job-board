const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { redirect } = require("express/lib/response");
const saltRounds = 10;
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const Developer = require("../models/developer.model");
const Job = require("../models/Job.model");


router.get("/dashboard", isLoggedIn,(req, res) => {
  res.render("developer/developer", {user:req.session.user})
});

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("developer/signup");
});


router.post("/signup", isLoggedOut, (req, res) => {
  const { firstname, lastname, password, email, resume } = req.body;
  if (!email) {
    return res.status(400).render("developer/signup", {
      errorMessage: "Please provide your email.",
    });
  }

  if (password.length < 8) {
    return res.status(400).render("developer/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    return res.status(400).render("signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  Developer.findOne({ email }).then((found) => {
    if (found) {
      return res
        .status(400)
        .render("developer/signup", { errorMessage: "Username already taken." });
    }
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return Developer.create({
          firstname,
          lastname,
          password: hashedPassword,
          email,
          resume,
        });
      })
      .then((user) => {
        req.session.user = user;
        res.redirect("dashboard");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("developer/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res
            .status(400)
            .render("developer/signup", { errorMessage: "Username need to be unique. The username you chose is already in use." });
        }
        return res
          .status(500)
          .render("developer/signup", { errorMessage: error.message });
      });
  });
});


router.get("/login", isLoggedOut, (req, res) => {
     

  const jobId = req.query.applyto;
  //  console.log('jobId:', jobId)
   if(jobId){
    console.log('job exists')
    res.render("developer/login", {jobId});
   }
   else{
    res.render('developer/login');
   }
});
router.post("/login", isLoggedOut, (req, res, next) => {
    const { email, password } = req.body;
   
  if (!email) {
    return res
      .status(400)
      .render("developer/login", { errorMessage: "Please provide your username." });
  }
  Developer.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .render("developer/login", { errorMessage: "Wrong credentials." });
      }
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("developer/login", { errorMessage: "Wrong credentials." });
        }

        req.session.user = user;
        return res.redirect("dashboard");
      });
    })
    .catch((err) => {
      next(err);
       return res.status(500).render("developer/login", { errorMessage: err.message });
    });
});


router.get("/createResume", isLoggedIn, (req,res)=>{
  Developer.findById(req.session.user._id)
  .then((foundUser)=>{
    res.render("developer/resume", {user:foundUser})
  })
})

router.post("/createResume", isLoggedIn,(req, res)=>{
  Developer.findByIdAndUpdate(req.session.user._id,{resume:req.body.resume},{new:true})
  .then((updatedUSer)=>{
    console.log(updatedUSer)
    res.redirect("/developer/createResume")
  })
})


router.get("/apply/:id", isLoggedIn, (req,res)=>{
    Developer.findById(req.session.user._id)
    .then((updatedUser)=>{
      const{id} = req.params
      Job.findById(id)
      .then((foundId)=>{
        res.render("developer/application", {user:updatedUser, foundId})
      })
    })
  });
  

router.post("/apply/:id", isLoggedIn,(req, res) =>{
  const{id} = req.params;
  Job.findByIdAndUpdate(id,{ $push: { "applicants": req.session.user._id } })
  .then((JobId)=>{
   res.render("developer/my-jobs")
  })
});




//Log Out
router.post("/logout",isLoggedIn, (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
