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
exports.Nps = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const createModal_1 = require("./nps/createModal");
class Nps {
    constructor() {
        this.appId = 'nps-core';
    }
    blockAction(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { triggerId, actionId, container: { id: viewId } = {}, payload: { value: score, blockId: npsId }, user, } = payload;
            if (!viewId || !triggerId || !user || !npsId) {
                throw new Error('Invalid payload');
            }
            const bannerId = viewId.replace(`${npsId}-`, '');
            return (0, createModal_1.createModal)({
                type: actionId === 'nps-score' ? 'modal.update' : 'modal.open',
                id: `${npsId}-${bannerId}`,
                appId: this.appId,
                npsId,
                triggerId,
                score: String(score),
                user,
            });
        });
    }
    viewSubmit(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            if (!((_b = (_a = payload.payload) === null || _a === void 0 ? void 0 : _a.view) === null || _b === void 0 ? void 0 : _b.state) || !((_d = (_c = payload.payload) === null || _c === void 0 ? void 0 : _c.view) === null || _d === void 0 ? void 0 : _d.id)) {
                throw new Error('Invalid payload');
            }
            const { payload: { view: { state, id: viewId }, }, user: { _id: userId, roles } = {}, } = payload;
            const [npsId] = Object.keys(state);
            const bannerId = viewId.replace(`${npsId}-`, '');
            const { [npsId]: { 'nps-score': score, comment }, } = state;
            yield core_services_1.NPS.vote({
                npsId,
                userId,
                comment: String(comment),
                roles,
                score: Number(score),
            });
            if (!userId) {
                throw new Error('invalid user');
            }
            yield core_services_1.Banner.dismiss(userId, bannerId);
            return true;
        });
    }
}
exports.Nps = Nps;
