"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = exports.createRandomId = exports.createRandomString = exports.chooseElement = void 0;
const random_1 = require("@rocket.chat/random");
exports.chooseElement = random_1.Random.choice;
exports.createRandomString = random_1.Random._randomString;
const createRandomId = () => random_1.Random.id();
exports.createRandomId = createRandomId;
const createToken = () => random_1.Random.hexString(64);
exports.createToken = createToken;
