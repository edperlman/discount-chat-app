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
exports.createTag = void 0;
const parseMeteorResponse_1 = require("../parseMeteorResponse");
const removeTag = (api, id) => __awaiter(void 0, void 0, void 0, function* () {
    return api.post('/method.call/omnichannel:removeTag', {
        message: JSON.stringify({ msg: 'method', id: '33', method: 'livechat:removeTag', params: [id] }),
    });
});
const createTag = (api_1, ...args_1) => __awaiter(void 0, [api_1, ...args_1], void 0, function* (api, { id = null, name, description = '', departments = [] } = {}) {
    const response = yield api.post('/method.call/livechat:saveTag', {
        message: JSON.stringify({
            msg: 'method',
            id: '33',
            method: 'livechat:saveTag',
            params: [id, { name, description }, departments],
        }),
    });
    const tag = yield (0, parseMeteorResponse_1.parseMeteorResponse)(response);
    return {
        response,
        data: tag,
        delete: () => __awaiter(void 0, void 0, void 0, function* () { return removeTag(api, tag === null || tag === void 0 ? void 0 : tag._id); }),
    };
});
exports.createTag = createTag;
