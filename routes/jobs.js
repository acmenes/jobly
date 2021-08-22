"use strict";

/** Routes for jobs */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth")

const Job = require("../models/job")

const router = new express.Router();

router.get("/", async function (req, res, next){
    try {
        const jobs = await Job.findAll();
        return res.json({ jobs });
    } catch (err) {
        return next(err)
    }
})

module.exports = router;