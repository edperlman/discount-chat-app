"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationService = exports.searchProviderService = void 0;
const SearchProviderService_1 = require("./SearchProviderService");
const SearchResultValidationService_1 = require("./SearchResultValidationService");
exports.searchProviderService = new SearchProviderService_1.SearchProviderService();
exports.validationService = new SearchResultValidationService_1.SearchResultValidationService();
