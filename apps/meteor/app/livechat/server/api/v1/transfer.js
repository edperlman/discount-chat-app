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
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../../api/server");
const getPaginationItems_1 = require("../../../../api/server/helpers/getPaginationItems");
const transfer_1 = require("../lib/transfer");
server_1.API.v1.addRoute('livechat/transfer.history/:rid', { authRequired: true, permissionsRequired: ['view-livechat-rooms'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid } = this.urlParams;
            const room = yield models_1.LivechatRooms.findOneById(rid, { projection: { _id: 1 } });
            if (!room) {
                throw new Error('invalid-room');
            }
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const history = yield (0, transfer_1.findLivechatTransferHistory)({
                rid,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            });
            return server_1.API.v1.success(history);
        });
    },
});
