const router = require('express').Router();
const Job = require('../models/Job.model');


router.get('/jobs/search', (req, res , ) => {
    
      const {jobTitle,company} = req.query;

      Job.findOne({$or:[{jobTitle},{company}]})
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
        console.log(jobId)
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