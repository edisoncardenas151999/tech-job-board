const { Schema, model } = require("mongoose");

const DeveloperSchema = new Schema({
  firstname:  String,
  lastname:  String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  resume: String,
  contact: Number,
  userType: String,
  imageUrl: String
}
);

const Developer = model("Developer", DeveloperSchema);

module.exports = Developer;