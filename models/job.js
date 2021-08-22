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
            `SELECT title,
                salary,
                equity,
                company_handle
            FROM jobs`);
    return jobsRes.rows;
    }
}

module.exports = Job;