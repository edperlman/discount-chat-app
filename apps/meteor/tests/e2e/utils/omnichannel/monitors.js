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
exports.createMonitor = void 0;
const parseMeteorResponse_1 = require("../parseMeteorResponse");
const removeMonitor = (api, id) => __awaiter(void 0, void 0, void 0, function* () {
    return api.post('/method.call/livechat:removeMonitor', {
        message: JSON.stringify({ msg: 'method', id: '33', method: 'livechat:removeMonitor', params: [id] }),
    });
});
const createMonitor = (api, id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.post('/method.call/livechat:addMonitor', {
        message: JSON.stringify({
            msg: 'method',
            id: '17',
            method: 'livechat:addMonitor',
            params: [id],
        }),
    });
    if (response.status() !== 200) {
        throw new Error(`Failed to create monitor [http status: ${response.status()}]`);
    }
    const monitor = yield (0, parseMeteorResponse_1.parseMeteorResponse)(response);
    return {
        response,
        data: monitor,
        delete: () => __awaiter(void 0, void 0, void 0, function* () { return removeMonitor(api, monitor._id); }),
    };
});
exports.createMonitor = createMonitor;
