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
exports.fetchUnitMonitors = exports.createOrUpdateUnit = void 0;
const faker_1 = require("@faker-js/faker");
const parseMeteorResponse_1 = require("../parseMeteorResponse");
const removeUnit = (api, id) => __awaiter(void 0, void 0, void 0, function* () {
    return api.post('/method.call/omnichannel:removeUnit', {
        message: JSON.stringify({ msg: 'method', id: '35', method: 'livechat:removeUnit', params: [id] }),
    });
});
const createOrUpdateUnit = (api_1, ...args_1) => __awaiter(void 0, [api_1, ...args_1], void 0, function* (api, { id = null, name, visibility, monitors, departments } = {}) {
    const response = yield api.post('/method.call/livechat:saveUnit', {
        message: JSON.stringify({
            msg: 'method',
            id: '34',
            method: 'livechat:saveUnit',
            params: [id, { name: name || faker_1.faker.commerce.department(), visibility: visibility || 'public' }, monitors, departments],
        }),
    });
    const unit = yield (0, parseMeteorResponse_1.parseMeteorResponse)(response);
    return {
        response,
        data: unit,
        delete: () => __awaiter(void 0, void 0, void 0, function* () { return removeUnit(api, unit === null || unit === void 0 ? void 0 : unit._id); }),
    };
});
exports.createOrUpdateUnit = createOrUpdateUnit;
const fetchUnitMonitors = (api, unitId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.get(`/livechat/units/${unitId}/monitors`);
    if (response.status() !== 200) {
        throw new Error(`Failed to fetch unit monitors [http status: ${response.status()}]`);
    }
    const { monitors } = yield response.json();
    return {
        response,
        data: monitors,
    };
});
exports.fetchUnitMonitors = fetchUnitMonitors;
