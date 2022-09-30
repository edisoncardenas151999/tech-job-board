
const {Schema, model} =  require('mongoose');

const jobSchema = new Schema({

    jobTitle: String,
    salaryMin: Number,
    salaryMax: Number,
    description: String

})


const Job = model('Job', jobSchema);
module.exports = Job;