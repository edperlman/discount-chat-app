"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAppsByCategories = void 0;
const filterAppsByCategories = (app, categories) => !app.categories || categories.length === 0 || app.categories.some((c) => categories.includes(c));
exports.filterAppsByCategories = filterAppsByCategories;
