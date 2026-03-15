const express = require('express');
const courseRouter = express.Router();
const {createCourse} = require('../controllers/courseController');
const {baseCourseValidator} = require("../services/validators/courseValidator")


courseRouter.post("/create/", baseCourseValidator, createCourse);

module.exports = courseRouter;