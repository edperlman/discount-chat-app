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
exports.updateValue = exports.getValue = exports.setValue = void 0;
const models_1 = require("@rocket.chat/models");
const cache = new Map();
const setValue = (_id, value) => cache.set(_id, value);
exports.setValue = setValue;
const setFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const setting = yield models_1.Settings.findOneById(_id, { projection: { value: 1 } });
    if (!setting) {
        return;
    }
    (0, exports.setValue)(_id, setting.value);
    return setting.value;
});
const getValue = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!cache.has(_id)) {
        return setFromDB(_id);
    }
    return cache.get(_id);
});
exports.getValue = getValue;
const updateValue = (id, fields) => {
    if (typeof fields.value === 'undefined') {
        return;
    }
    (0, exports.setValue)(id, fields.value);
};
exports.updateValue = updateValue;
