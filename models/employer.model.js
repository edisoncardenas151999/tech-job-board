const { Schema, model } = require("mongoose");

const employerSchema = new Schema({
firstname: String,
lastname: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  jobs: [{type: Schema.Types.ObjectId, ref: 'Job'}],
  userType: String,
  company:   String,
}
);

const Employer = model("Employer ", employerSchema);

module.exports = Employer ;