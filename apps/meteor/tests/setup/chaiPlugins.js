"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const chai_datetime_1 = __importDefault(require("chai-datetime"));
const chai_dom_1 = __importDefault(require("chai-dom"));
const chai_spies_1 = __importDefault(require("chai-spies"));
chai_1.default.use(chai_spies_1.default);
chai_1.default.use(chai_datetime_1.default);
chai_1.default.use(chai_dom_1.default);
chai_1.default.use(chai_as_promised_1.default);
