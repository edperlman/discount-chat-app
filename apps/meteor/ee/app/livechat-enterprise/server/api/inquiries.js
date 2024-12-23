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
const inquiries_1 = require("./lib/inquiries");
const server_1 = require("../../../../../app/api/server");
server_1.API.v1.addRoute('livechat/inquiry.setSLA', {
    authRequired: true,
    permissionsRequired: {
        PUT: { permissions: ['view-l-room', 'manage-livechat-sla'], operation: 'hasAny' },
    },
}, {
    put() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, sla } = this.bodyParams;
            if (!roomId) {
                return server_1.API.v1.failure("The 'roomId' param is required");
            }
            yield (0, inquiries_1.setSLAToInquiry)({
                userId: this.userId,
                roomId,
                sla,
            });
            return server_1.API.v1.success();
        });
    },
});
