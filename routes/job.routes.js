const router = require('express').Router();
const Job = require('../models/Job.model');


router.get('/jobs/search', (req, res , ) => {
      console.log(req.query)
      const {jobTitle} = req.query;

      Job.findOne({jobTitle })
      . then ( (Results) => {
        console.log(Results);
        res.render('jobs/job-results', {jobs:Results})
      })
      .catch( (error) => {
        console.log('Error while getting the data from the DB: ', error);
      });
    
});

router.get('/jobs/:jobId/description', (req, res, ) => {
      
      const {jobId} = req.params;
       
      Job.findById(jobId)
       .then( (jobDetails) => {
        console.log('Job details: ', jobDetails);
        res.render('jobs/job-description', {job: jobDetails})
       })
       .catch( (error) => {
        console.log('Error while retrieving the data from the DB: ', error);
       });
})









module.exports = router;