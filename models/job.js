"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for jobs */

class Job {
    /** create a job from data, update, delete, and return data */

    /** Find all jobs */
    static async findAll({ minSalary, hasEquity, title } = {}) {
        let query = 
            `SELECT j.id,
                j.title,
                j.salary,
                j.equity,
                j.company_handle AS companyHandle
                c.name AS companyName
            from JOBS j LEFT JOIN companies AS c ON c.handle = j.company_handle `;
        let whereExpressions = [];
        let queryValues = [];

        if (minSalary !== undefined) {
            queryValues.push(minSalary);
            whereExpressions.push(`salary >= $${queryValues.length}`);
          }
      
          if (hasEquity === true) {
            whereExpressions.push(`equity > 0`);
          }
      
          if (title !== undefined) {
            queryValues.push(`%${title}%`);
            whereExpressions.push(`title ILIKE $${queryValues.length}`);
          }
      
          if (whereExpressions.length > 0) {
            query += " WHERE " + whereExpressions.join(" AND ");
          }
        /// finalize the query based on the previous parameters
        query += " ORDER BY title "
        const jobsRes = await db.query(query, queryValues)
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