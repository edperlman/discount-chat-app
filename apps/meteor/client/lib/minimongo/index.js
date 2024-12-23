"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComparatorFromSort = exports.createFilterFromQuery = void 0;
const query_1 = require("./query");
const sort_1 = require("./sort");
exports.createFilterFromQuery = query_1.compileDocumentSelector;
exports.createComparatorFromSort = sort_1.compileSort;
