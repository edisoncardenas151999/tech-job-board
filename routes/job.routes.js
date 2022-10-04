const router = require('express').Router();
const Job = require('../models/Job.model');

      // GET route to search for jobs and companies
router.get('/jobs/search', (req, res ) => {
    
      const {q:query} = req.query;
      console.log(query)
      
      Job.find({$or:[
        {jobTitle: {'$regex':query, '$options':'i'}},
        {company: {'$regex':query, '$options':'i'}}
      
      ]})
      . then ( (results) => {
        console.log(results);
        res.render('jobs/job-results', {jobs:results})
      })
      .catch( (error) => {
        console.log('Error while getting the data from the DB: ', error);
      });
    
});
 // GET route to see company details

router.get('/jobs/:jobId', (req, res, ) => {
      
      const {jobId} = req.params;
       
      Job.findById(jobId)
       .then( (jobDetails) => {
        console.log('Job details: ', jobDetails);
        res.render('jobs/job-description', {job: jobDetails})
       })
       .catch( (error) => {
        console.log('Error while retrieving the data from the DB: ', error);
       });
});

  // GET route to apply for a specific job

  // router.get('/jobs/apply', (req, res, ) => {
  //   res.render('jobs/job-apply');
  // })








module.exports = router;