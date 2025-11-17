// Node Modules
const express = require("express");

// Express Router
const router = express.Router();

// Controllers
const mycityController = require("../controllers/mycitycontroller");

// Main Router
router.get("/", (req, res) => {
	return res.status(200).json({ message: "MyCity Decode MQTT Microservice", version: process.env.VERSION });
});

// MyCity
router.post("/mycity/decode", mycityController.decodeData);

// Module Export
module.exports = router;
