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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const addCustomOAuth_1 = __importDefault(require("../fixtures/addCustomOAuth"));
const inject_initial_data_1 = __importDefault(require("../fixtures/inject-initial-data"));
const insert_apps_1 = __importDefault(require("../fixtures/insert-apps"));
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, inject_initial_data_1.default)();
        yield (0, insert_apps_1.default)();
        yield (0, addCustomOAuth_1.default)();
    });
}
