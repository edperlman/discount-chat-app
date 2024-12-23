"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJob = void 0;
const Job_1 = require("./Job");
const createJob = (agenda, jobData) => {
    return new Job_1.Job(Object.assign({ agenda }, jobData));
};
exports.createJob = createJob;
