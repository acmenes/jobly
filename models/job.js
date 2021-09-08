"use strict";

const { NotFoundError } = require("../expressError");
const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for jobs */

class Job {
    /** create a job from data, update, delete, and return data */

    /** Create a new job */
    static async create(data) {
      const result = await db.query(`
            INSERT INTO jobs (title, salary, equity, company_handle)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, salary, equity, company_handle as "companyHandle"`,
            [data.title, data.salary, data.equity, data.companyHandle]);
      let job = result.rows[0]

      return job;
    }

    /** Find all jobs */
    static async findAll({ minSalary, hasEquity, title } = {}) {
      let query = `SELECT j.id,
                          j.title,
                          j.salary,
                          j.equity,
                          j.company_handle AS "companyHandle",
                          c.name AS "companyName"
                   FROM jobs j 
                     LEFT JOIN companies AS c ON c.handle = j.company_handle`;
      let whereExpressions = [];
      let queryValues = [];
  
      // For each possible search term, add to whereExpressions and
      // queryValues so we can generate the right SQL
  
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
  
      // Finalize query and return results
  
      query += " ORDER BY title";
      const jobsRes = await db.query(query, queryValues);
      return jobsRes.rows;
    }

    /* Get a single job by its ID number */
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

    /** Handle updating a job listing */
    static async update(id, data) {
      const { setCols, values } = sqlForPartialUpdate(
        data, {});

      const idIdx = "$" + (values.length + 1);

      const querySql = `UPDATE jobs
                        SET ${setCols}
                        WHERE id = ${idIdx}
                        RETURNING id, title, salary, equity, company_handle AS "companyHandle`;
      const result = await db.query(querySql, [...values, id]);
      const job = result.rows[0];
      if (!job) throw new NotFoundError(`Cannot update, no job with ID of ${id}`);

      return job;
    }

    /** Handle removal of a job listing */
    static async remove(id) {
      const result =  await db.query(
        `DELETE
        FROM jobs
        WHERE id = $1
        RETURNING id`, [id]);

      const job = result.rows[0];

      if(!job) throw new NotFoundError(`Cannot delete, no job with ID of ${id}`)
    }
}

module.exports = Job;