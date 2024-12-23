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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const server_1 = require("../../../../api/server");
const getPaginationItems_1 = require("../../../../api/server/helpers/getPaginationItems");
const triggers_1 = require("../../../server/api/lib/triggers");
server_1.API.v1.addRoute('livechat/triggers', {
    authRequired: true,
    permissionsRequired: ['view-livechat-manager'],
    validateParams: {
        GET: rest_typings_1.isGETLivechatTriggersParams,
        POST: rest_typings_1.isPOSTLivechatTriggersParams,
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const triggers = yield (0, triggers_1.findTriggers)({
                pagination: {
                    offset,
                    count,
                    sort,
                },
            });
            return server_1.API.v1.success(triggers);
        });
    },
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, name, description, enabled, runOnce, conditions, actions } = this.bodyParams;
            if (_id) {
                yield models_1.LivechatTrigger.updateById(_id, { name, description, enabled, runOnce, conditions, actions });
            }
            else {
                yield models_1.LivechatTrigger.insertOne({ name, description, enabled, runOnce, conditions, actions });
            }
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('livechat/triggers/:_id', { authRequired: true, permissionsRequired: ['view-livechat-manager'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const trigger = yield (0, triggers_1.findTriggerById)({
                triggerId: this.urlParams._id,
            });
            return server_1.API.v1.success({
                trigger,
            });
        });
    },
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, triggers_1.deleteTrigger)({
                triggerId: this.urlParams._id,
            });
            return server_1.API.v1.success();
        });
    },
});
