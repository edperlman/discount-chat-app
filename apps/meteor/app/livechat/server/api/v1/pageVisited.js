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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const server_1 = require("../../../../api/server");
const tracking_1 = require("../../lib/tracking");
server_1.API.v1.addRoute('livechat/page.visited', { validateParams: rest_typings_1.isPOSTLivechatPageVisitedParams }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, rid, pageInfo } = this.bodyParams;
            const message = yield (0, tracking_1.savePageHistory)(token, rid, pageInfo);
            if (!message) {
                return server_1.API.v1.success();
            }
            const { msg, navigation } = message;
            return server_1.API.v1.success({ page: { msg, navigation } });
        });
    },
});
