"use strict";

/** Routes for jobs */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");

const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");
const jobSearchSchema = require("../schemas/jobSearch.json");
const { KeyObject } = require("crypto");

const router = new express.Router({ mergeParams: true });


/** Retrieves all the jobs available, query optional */
router.get("/", async function (req, res, next){
    const query = req.query;
    if(query.minSalary !== undefined) query.minSalary = +query.minSalary;
    query.hasEquity = query.hasEquity === "true";

    try {
        const validator = jsonschema.validate(query, jobSearchSchema);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
        }
        const jobs = await Job.findAll(query)
        return res.json({ jobs });
    } catch (err) {
        return next(err)
    }
})

/** Allows users with the hasAdmin flag in the db to post a new job */
router.post("/", ensureAdmin, async function (req, res, next){
    try{
        const validator = jsonschema.validate(req.body, jobNewSchema)
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        
        const job = await Job.create(req.body)
        return res.status(201).json({ job })
    } catch (err) {
        return next(err)
    }
})

/** Get a single job posting by its id */
router.get("/:id", async function (req, res, next){
    try{
        const job = await Job.get(req.params.id)
        return res.json({ job })
    } catch (err) {
        return next(err)
    }
})

/** Given that a user is an admin, they can edit a job */
router.patch("/:id", ensureAdmin, async function (req, res, next){
    try {
        const validator = jsonschema.validate(req.body, jobUpdateSchema)
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const job = await Job.update(req.params.id, req.body)
        return res.status(201).json({ job })
    } catch (err) {
        return next(err)
    }
})

/** Given that a user is an admin, they can delete a job */
router.delete("/:id", ensureAdmin, async function (req, res, next){
    try {
        await Job.remove(req.params.id)
        return res.json({ deleted: req.params.id})
    }catch (err) {
        return next(err)
    } 
})

module.exports = router;