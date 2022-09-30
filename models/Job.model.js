
const {Schema, model} =  require('mongoose');

const jobSchema = new Schema({

    jobTitle: String,
    company: String,
    location: String,
    salary: Number,
    description: String

})


const Job = model('Job', jobSchema);
module.exports = Job;