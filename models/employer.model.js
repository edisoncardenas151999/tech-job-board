const { Schema, model } = require("mongoose");

const employerSchema = new Schema({
  firstname: {
    type: String,
    unique: true,
  },
 lastname: {
    type: String,
    unique: true,
  },
  email: String,
  password: String,
  jobs: [{type: Schema.Types.ObjectId, ref: 'Job'}],
  userType: String,
  company: {
    type: String,
    uppercase: true,
  }
}
);

const Employer = model("Employer ", employerSchema);

module.exports = Employer ;