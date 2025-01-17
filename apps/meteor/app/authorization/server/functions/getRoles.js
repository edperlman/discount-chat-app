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
exports.getRoleIds = exports.getRoles = void 0;
const models_1 = require("@rocket.chat/models");
const getRoles = () => __awaiter(void 0, void 0, void 0, function* () { return models_1.Roles.find().toArray(); });
exports.getRoles = getRoles;
const getRoleIds = () => __awaiter(void 0, void 0, void 0, function* () { return (yield models_1.Roles.find({}, { projection: { _id: 1 } }).toArray()).map(({ _id }) => _id); });
exports.getRoleIds = getRoleIds;
