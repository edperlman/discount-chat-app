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
exports.createManager = void 0;
const createManager = (api, username) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.post('/livechat/users/manager', {
        username,
    });
    if (response.status() !== 200) {
        throw Error(`Unable to create manager [http status: ${response.status()}]`);
    }
    const { user: manager } = yield response.json();
    return {
        response,
        data: manager,
        delete: () => __awaiter(void 0, void 0, void 0, function* () { return api.delete(`/livechat/users/manager/${manager._id}`); }),
    };
});
exports.createManager = createManager;
