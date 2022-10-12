const router = require('express').Router();
const Job = require('../models/Job.model');

      // GET route to search for jobs and companies
router.get('/jobs/search', (req, res ) => {
        console.log(req.query)
        const query = req.query.q;
      
      Job.find({$or:[
        {jobTitle: {'$regex':query, '$options':'i'}},
        {company: {'$regex':query, '$options':'i'}}
      
      ]})
      . then ( (results) => {
        res.render('jobs/job-results', {jobs:results,user: req.session.user,  title:"Job Results"})
      })
      .catch( (error) => {
        console.log('Error while getting the data from the DB: ', error);
      });
    
});
 // GET route to see company details

router.get('/jobs/:jobId', (req, res, ) => {
    // pass in current user in hbs
      const {jobId} = req.params;
      Job.findById(jobId)
       .then( (jobDetails) => {
        res.render('jobs/job-description', {job: jobDetails, user: req.session.user,  title:"Job Description"})
       })
       .catch( (error) => {
        console.log('Error while retrieving the data from the DB: ', error);
       });
});

module.exports = router;