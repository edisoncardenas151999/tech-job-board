const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose= require('mongoose');
const { redirect } = require("express/lib/response");
const saltRounds = 10;
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const Developer = require("../models/developer.model");
const Job = require("../models/Job.model");


router.get("/dashboard", isLoggedIn,(req, res) => {
  if(req.session.user.userType === "developer"){
    res.render("developer/dashboard", {user:req.session.user, title:"Dashboard"})
  }
  else if (req.session.user.userType === "employer"){
    res.render("employer/dashboard", {user:req.session.user, title:"Dashboard"})
  }
  });

router.get("/signup", isLoggedOut, (req, res) => {
  const jobId = req.query.applyto;
   if(jobId){
    res.render("developer/signup", {jobId, title:"Developer Sign up"});
   }
   else{
    res.render('developer/signup', {title:"Developer Sign up"});
   }
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { firstname, lastname, password, email, resume, contact } = req.body;
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
        .render("developer/signup", { errorMessage: "Email already taken." });
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
          contact,
          userType: "developer"
        });
      })
      .then((user) => {
        req.session.user = user;
        if(req.query.applyto ){
          res.render("developer/application", {user:req.session.user, jobId:req.query.applyto})
        }
       else { return res.redirect("dashboard")};

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
            .render("developer/signup", { errorMessage: "Email need to be unique. The Email you chose is already in use." });
        }
        return res
          .status(500)
          .render("developer/signup", { errorMessage: error.message });
      });
  });
});


router.get("/login", isLoggedOut, (req, res) => {
  const jobId = req.query.applyto;
   if(jobId){
    res.render("developer/login", {jobId,  title:"Developer Log In"});
   }
   else{
    res.render('developer/login',{title:"Developer Log in"});
   }
});
router.post("/login", isLoggedOut, (req, res, next) => {
  console.log(req.query)
    const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .render("developer/login", { errorMessage: "Please provide your email and password." });
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

        req.session.user = user
        req.query.applyto 
        if(req.query.applyto ){
          res.render("developer/application", {user:req.session.user, jobId:req.query.applyto})
        }
       else { return res.redirect("dashboard")}

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
    res.render("developer/resume", {user:foundUser,  title:"Create Resume"})
  })
})

router.post("/createResume", isLoggedIn,(req, res)=>{
  console.log("hi")
  Developer.findByIdAndUpdate(req.session.user._id,{resume:req.body.resume},{new:true})
  .then((updatedUSer)=>{
    console.log(updatedUSer)
    res.redirect("/developer/dashboard")
  })
})
 
router.post('/dashboard/:userId/delete', (req, res, next) => {
   console.log(req.params);
   const {userId} = req.params;

   Developer.findByIdAndDelete(userId)
    .then( () => {
      console.log('Developer deleted.');
      req.session.destroy( (error) => {
        if(error){
          next(error)
        }
        res.redirect('/');
      })
     
    })
    .catch( (error) => {
      console.log('Error while deleting user: ', error)
    })
});


router.get("/apply/:id", isLoggedIn, (req,res)=>{
  Developer.findById(req.session.user._id)
  .then((updatedUser)=>{
    const {id}= req.params
    Job.findById(id)
    .then((foundId)=>{
      if(foundId.applicants.includes(req.session.user._id)){
        res.render("developer/application-error", {user:req.session.user, errorMessage: "already applied to this job." ,  title:"Apply for Job"})
      }
      res.render("developer/application", {user:updatedUser, foundId,  title:"Apply for Job"})
    })
  })
})

router.post("/apply/:id", isLoggedIn,(req, res) =>{
const {id} = req.params
Job.findById(id)
.then((foundId)=>{
  if (foundId.applicants.includes(req.session.user._id)) {
    return res
      .status(400)
      .render('developer/application-error',{errorMessage: "already applied to this job." , user:req.session.user});
  }
Job.findByIdAndUpdate(id,{ $push: { "applicants": req.session.user._id } })
.then((JobId)=>{
 res.render("developer/my-jobs", {user:req.session.user})
})
});
})





router.get("/myJobs", isLoggedIn, (req,res)=>{
 Job.find({applicants:req.session.user._id})
 .then((data)=>{
 res.render('developer/view-my-jobs', {user:req.session.user, job:data})
 })

})



//Log Out
router.post("/logout",isLoggedIn, (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect("/");
  });
});




module.exports = router;
