"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Job = require("./job.js");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterAll,
    commonAfterEach,
    testJobIds,
} = require("./_testCommon")

beforeAll(commonBeforeAll)
beforeEach(commonBeforeEach)
afterAll(commonAfterAll)
afterEach(commonAfterEach)



// describe each function (create, update, delete, find and write a test)

/********* create */
describe("create", function (){
    let newJob = {
        title: "test",
        salary: "100000000000",
        equity: "0.1",
        handle: "job"
    }
    test("create function works", function(){
        let testJob = await Job.create(newJob)
        expect(testJob).toEqual(newJob)
    })
})

/********* find all */
describe("findAll", function (){

})

/********* get one job */
describe("get", function (){

})

/********* update */
describe("update", function (){

})

/********* remove */
describe("remove", function (){

})