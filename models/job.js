"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for jobs */

class Job {
    /** create a job from data, update, delete, and return data */

    /** Find all jobs */
    static async findAll() {
        const jobsRes = await db.query(
            `SELECT id,
                title,
                salary,
                equity,
                company_handle
            FROM jobs`);
    return jobsRes.rows;
    }

    static async get(id){
        const jobRes = await db.query(
            `SELECT id, 
                title, 
                salary, 
                equity, 
                company_handle 
            FROM jobs 
            WHERE id = $1`, [id],
        )
    const job = jobRes.rows;
    return job
    }
}

module.exports = Job;