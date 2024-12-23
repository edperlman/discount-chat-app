"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSLA = exports.generateRandomSLAData = void 0;
const faker_1 = require("@faker-js/faker");
const core_typings_1 = require("@rocket.chat/core-typings");
const test_1 = require("../test");
const generateRandomSLAData = () => ({
    name: faker_1.faker.person.firstName(),
    description: faker_1.faker.lorem.sentence(),
    dueTimeInMinutes: faker_1.faker.number.int({ min: 10, max: core_typings_1.DEFAULT_SLA_CONFIG.ESTIMATED_WAITING_TIME_QUEUE }),
});
exports.generateRandomSLAData = generateRandomSLAData;
const createSLA = (api) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.post('/livechat/sla', (0, exports.generateRandomSLAData)());
    (0, test_1.expect)(response.status()).toBe(200);
    const { sla } = (yield response.json());
    return sla;
});
exports.createSLA = createSLA;
