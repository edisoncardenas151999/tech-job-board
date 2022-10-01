
const mongoose = require("mongoose");
const Job  = require("../models/Job.model.js")

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/project-2";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

  const data = [

 {
    jobTitle:'Web Developer',
    company: 'Adecco',
    location: 'PittsField, NH',
    salary: 60000,
    description: 'Adecco is assisting our client, MSA Globe, a global designer, manufacturer, and distributor of safety devices and equipment, in staffing a temporary Web Developer position at their Pittsfield, NH location. This is a 4+ month contract assignment. This position can support remote, hybrid or on-site; however, candidate must be available for a minimum of two on-site visits for training/setup purposes.'
 },
 {
    jobTitle:'Web Developer',
    company: 'SPECTRUM',
    location: 'Coppell, TX',
    salary: 70000,
    description: "Design, develop, modify, and implement applications and/or services designed to support organizations applications. This position will code and perform unit and integration testing of software to ensure proper and efficient execution and adherence to business and technical requirements."
 },

 {
    jobTitle:'Jr. Net Web Developer',
    company: 'QT9 Software',
    location: 'Aurora, IL',
    salary: 50000,
    description: "QT9 Software is seeking a self-motivated and quick learning Jr. Net Web Developer to join our Development Team. As a Jr.Net Web Developer, you will actively be developing core software in both the web and WinForms. It is expected to not only develop code but come up with new effective ways to solve interface and process challenges."
 },
 {
    jobTitle:'Full Stack Web Developer',
    company: 'delaware county community college',
    location: 'Media, PA',
    salary: 90000,
    description: "The Full Stack Web Developer in collaboration with the Web Team will develop, maintain, and provide support for the Colleges Drupal content management system which powers the Colleges public website, web portal and Customer Service wiki as well as administer and support the College SaaS mobile app. "
 },

 {
  jobTitle:'Full Stack Web Developer',
  company: 'media Query',
  location: 'Miami, FL',
  salary: 90000,
  description: "The Full Stack Web Developer in collaboration with the Web Team will develop, maintain, and provide support for the Colleges Drupal content management system which powers the Colleges public website, web portal and Customer Service wiki as well as administer and support the College SaaS mobile app. "
}
 
  ]

  Job.create(data)
  .then( (jobsFromDB) => {
    console.log(`Added ${jobsFromDB.length} jobs to the DB: `, jobsFromDB);
    mongoose.connection.close();
  })
  .catch( (error) => {
    console.log('Error while inserting jobs to the DB: ', error);
  });

