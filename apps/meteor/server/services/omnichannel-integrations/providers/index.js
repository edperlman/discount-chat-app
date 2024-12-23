"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSmsProviders = void 0;
const mobex_1 = require("./mobex");
const twilio_1 = require("./twilio");
const voxtelesys_1 = require("./voxtelesys");
const registerSmsProviders = (register) => {
    // @ts-expect-error TODO: investigate Mobex usability and why types differ
    register('mobex', mobex_1.Mobex);
    register('twilio', twilio_1.Twilio);
    register('voxtelesys', voxtelesys_1.Voxtelesys);
};
exports.registerSmsProviders = registerSmsProviders;
