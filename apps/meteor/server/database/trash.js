"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trashCollection = void 0;
const utils_1 = require("./utils");
const Trash_1 = require("../models/raw/Trash");
const Trash = new Trash_1.TrashRaw(utils_1.db);
exports.trashCollection = Trash.col;
