// Environment Config
require("dotenv").config();

// Uncaught Exceptions
process.on("uncaughtException", (err) => {
	console.error(`Uncaught Exception: ${err.stack}`);
	return process.exit(1);
});

// Node Modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const http = require("http");

// Express App
const app = express();
app.locals.Context = process.env.CONTEXT;

// Request Setup
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));

// Router Init
const router = require("./source/setup/router");
router.use("/assets", express.static(path.join(__dirname, "/source/assets")));
app.use(process.env.CONTEXT, router);

// Start Server
http.createServer(app).listen(process.env.PORT);
console.log(`Server is listening on http://localhost:${process.env.PORT}${process.env.CONTEXT}`);
