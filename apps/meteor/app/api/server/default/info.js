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
const api_1 = require("../api");
const getLoggedInUser_1 = require("../helpers/getLoggedInUser");
const getServerInfo_1 = require("../lib/getServerInfo");
api_1.API.default.addRoute('info', { authRequired: false }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, getLoggedInUser_1.getLoggedInUser)(this.request);
            return api_1.API.v1.success(yield (0, getServerInfo_1.getServerInfo)(user === null || user === void 0 ? void 0 : user._id));
        });
    },
});
api_1.API.default.addRoute('ecdh_proxy/initEncryptedSession', { authRequired: false }, {
    post() {
        return {
            statusCode: 200,
            body: {
                success: false,
                error: 'Not Acceptable',
            },
        };
    },
});
