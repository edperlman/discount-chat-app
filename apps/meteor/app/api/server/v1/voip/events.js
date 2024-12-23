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
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const server_1 = require("../../../../authorization/server");
const api_1 = require("../../api");
api_1.API.v1.addRoute('voip/events', { authRequired: true, permissionsRequired: ['view-l-room'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, {
                event: check_1.Match.Where((v) => {
                    return Object.values(core_typings_1.VoipClientEvents).includes(v);
                }),
                rid: String,
                comment: check_1.Match.Maybe(String),
            });
            const { rid, event, comment } = this.bodyParams;
            const room = yield models_1.VoipRoom.findOneVoipRoomById(rid);
            if (!room) {
                return api_1.API.v1.notFound();
            }
            if (!(yield (0, server_1.canAccessRoomAsync)(room, this.user))) {
                return api_1.API.v1.unauthorized();
            }
            return api_1.API.v1.success(yield core_services_1.LivechatVoip.handleEvent(event, room, this.user, comment));
        });
    },
});
