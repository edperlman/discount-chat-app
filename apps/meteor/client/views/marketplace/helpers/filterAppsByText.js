"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAppsByText = void 0;
const filterAppsByText = (name, text) => name.toLowerCase().indexOf(text.toLowerCase()) > -1;
exports.filterAppsByText = filterAppsByText;
