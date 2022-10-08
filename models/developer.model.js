const { Schema, model } = require("mongoose");

const DeveloperSchema = new Schema({
  firstname: {
    type: String,
    unique: true,
    uppercase: true,
  },
 lastname: {
    type: String,
    unique: true,
    uppercase: true,
  },
  email: String,
  password: String,
  resume: String,
  contact: Number,
  userType: String,
}
);

const Developer = model("Developer", DeveloperSchema);

module.exports = Developer;