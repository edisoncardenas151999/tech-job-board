// Lines 2 and 3 needed - notes from User Auth - Feb 9th
const session = require("express-session");
const MongoStore = require("connect-mongo");
// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// default value for title local
const projectName = "project-2";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;



// 👇 Start handling routes here

// Don't need to memorize, one-and-done, allows us to call session in route

const index = require("./routes/index");
app.use("/", index);
const developer= require("./routes/developer");
app.use("/developer", developer);
const employer = require("./routes/employer");
app.use("/employer", employer );

const jobRoutes = require("./routes/job.routes");
app.use('/', jobRoutes);
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
