"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app")

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    testJobIds,
    adminToken,
  } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
    const newJob = {
        id: 1111111111, 
        title: "Dog Walker",
        salary: "999,999",
        equity: ".9",
        handle: "dog"
    };

test("can post job", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
    expect(resp.statusCode).toEqual(201);
})
test("unauthorized for non-admin", async function (){
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
    expect(resp.statusCode).toEqual(403)
})
})

/**************************************** GET /jobs */

describe("GET /jobs", function () {

})

/**************************************** GET /job by id*/

describe("GET /jobs/:id", function () {

})

/**************************************** PATCH /job by id */

describe("PATCH /jobs/:id", function (){

})

/**************************************** DELETE /job by id */

describe("DELETE /jobs/:id", function (){

})