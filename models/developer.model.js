const { Schema, model } = require("mongoose");

const DeveloperSchema = new Schema({
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
  resume: String,
  contact: Number,
}
);

const Developer = model("Developer", DeveloperSchema);

module.exports = Developer;