
const {Schema, model} =  require('mongoose');

const jobSchema = new Schema({

    jobTitle:{
        type: String,
        lowercase: true
    },
    company:{
        type: String,
        lowercase: true
    } ,
    location: String,
    salary: String,
    workHours: String,
    description: String,
    applicants: [{type: Schema.Types.ObjectId, ref: 'Developer'}]



const Job = model('Job', jobSchema);
module.exports = Job;