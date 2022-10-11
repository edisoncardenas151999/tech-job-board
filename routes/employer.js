const router = require("express").Router();
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
const { redirect } = require("express/lib/response");
const saltRounds = 10;
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const Employer = require("../models/employer.model")
const Job = require("../models/Job.model");




router.get("/dashboard", isLoggedIn,(req, res) => {
  if(req.session.user.userType === "employer"){
    res.render("employer/dashboard", {user:req.session.user})
  }
  else if (req.session.user.userType === "developer"){
    res.render("developer/dashboard", {user:req.session.user})
  }
});

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("employer/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { firstname, lastname, password, email, company} = req.body;
  if (!email) {
    return res.status(400).render("employer/signup", {
      errorMessage: "Please provide your email.",
    });
  }

  if (password.length < 8) {
    return res.status(400).render("employer/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    res.status(500).render("signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  Employer.findOne({ email }).then((found) => {
    if (found) {
      return res
        .status(400)
        .render("employer/signup", { errorMessage: "Username already taken." });
    }
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return Employer.create({
          firstname,
          lastname,
          email,
          password: hashedPassword,
          company,
          userType : "employer"
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
            .render("employer/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res
            .status(400)
            .render("employer/signup", { errorMessage: "Username need to be unique. The username you chose is already in use." });
        }
        return res
          .status(500)
          .render("employer/signup", { errorMessage: error.message });
      });
  });
});


router.get("/login", isLoggedOut, (req, res) => {
  res.render("employer/login");
});
router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .render("employer/login", { errorMessage: "Please provide your username." });
  }

  Employer.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .render("employer/login", { errorMessage: "Wrong credentials." });
      }
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("employer/login", { errorMessage: "Wrong credentials." });
        }

        req.session.user = user;
        return res.redirect("dashboard");
      });
    })
    .catch((err) => {
      next(err);
       return res.status(500).render("employer/login", { errorMessage: err.message });
    });
});



router.get("/createJobPost", isLoggedIn,(req, res) => {
  console.log(req.session.user)
 res.render("employer/job-post",{user:req.session.user})
})



router.get("/jobs", isLoggedIn, (req,res)=>{
  console.log(req.session.user._id)
  Employer.findById(req.session.user._id)
 .populate('jobs')
  .then((updatedUser)=>{
   res.render("employer/jobs", {user:updatedUser})
  })
})
 
router.post("/createJobPost", isLoggedIn,(req, res) =>{
   const{ jobTitle, company, salary, description, location } = req.body
   Job.create( {jobTitle, company, salary, description, location })
   .then((newJob)=>{
    Employer.findByIdAndUpdate(req.session.user._id, { $push: { "jobs": newJob._id } } )
    .then((updatedEmployer) =>{
      res.redirect("jobs")
    })
   })
   .catch( (error) => {
    console.log(error);
  });
});


router.get("/:id/edit", isLoggedIn, (req,res)=>{
  const { id } = req.params;
  Job.findById(id)
  .populate('applicants')
  .then((foundJob)=>{
    console.log(foundJob)
    res.render("employer/job-edit", {user:foundJob})
  })
})
 
router.post("/:id/edit", isLoggedIn,(req, res) =>{
  const { id } = req.params;
  const{ jobTitle, company, salary, description, location } = req.body
  Job.findByIdAndUpdate(id, { jobTitle, company, salary, description, location }, { new: true })
.then((newJob)=>{
  console.log(newJob)
  res.redirect("/employer/jobs")
})
});

router.get("/:id/applicants", isLoggedIn, (req,res)=>{
  const { id } = req.params;
  Job.findById(id)
  .populate('applicants')
  .then((foundApplicants)=>{
    console.log(foundApplicants)
    res.render("employer/job-applicants", {applicants:foundApplicants.applicants, user:req.session.user})
  })
})



router.get("/createJobPost", isLoggedIn,(req, res) => {
  res.render("employer/job-post", {user:req.session.user})
});

router.post("/createJobPost", isLoggedIn,(req, res) => {
 const{jobTitle,salary,company,description} = req.body
  Job.create({jobTitle,salary,company,description})
  .then( (jobFromDB) => {
    console.log(jobFromDB._id)
    console.log(req.session.user.jobs)
    const jobs = [...req.session.user.jobs, jobFromDB._id]
    console.log(jobs)
    Employer.findByIdAndUpdate(req.session.user._id, { jobs })
    .then((updatedEmployer)=>{
      req.session.user = {...updatedEmployer}
      console.log(req.session.user.name)
      console.log(req.session.user)
    })
  })
  .catch( (error) => {
    console.log('Error while inserting jobs to the DB: ', error);
  });
});

// delete account
 
router.post('/dashboard/:userId/delete', (req, res, next) => {
   console.log(`employer id: ${req.params.userId}`)
   const {userId} =req.params;

   Employer.findByIdAndDelete(userId)
   .then( () => {
    console.log('employer deleted.')
    req.session.destroy( (error) => {
      if(error){
        next(error);
      }
      res.redirect('/');
    })
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
