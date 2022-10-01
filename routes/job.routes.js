const router = require('express').Router();
const Job = require('../models/Job.model');


router.get('/jobs/search', (req, res , ) => {
    
      const {q:query} = req.query;
      console.log(query)
      Job.find({
        $or:[
          {jobTitle:query},
          {company:query}
        ]
      })
      . then ( (results) => {
        console.log(results);
        res.render('jobs/job-results', {jobs:results})
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
});









module.exports = router;