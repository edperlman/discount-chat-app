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
exports.VideoConfModule = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const i18n_1 = require("../../lib/i18n");
class VideoConfModule {
    constructor() {
        this.appId = 'videoconf-core';
    }
    blockAction(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { triggerId, actionId, payload: { blockId: callId }, user: { _id: userId } = {}, } = payload;
            if (!callId) {
                throw new Error('invalid call');
            }
            if (actionId === 'join') {
                yield core_services_1.VideoConf.join(userId, callId, {});
            }
            if (actionId === 'info') {
                const blocks = yield core_services_1.VideoConf.getInfo(callId, userId);
                return {
                    type: 'modal.open',
                    triggerId,
                    appId: this.appId,
                    view: {
                        appId: this.appId,
                        type: 'modal',
                        id: `${callId}-info`,
                        title: {
                            type: 'plain_text',
                            text: i18n_1.i18n.t('Video_Conference_Info'),
                            emoji: false,
                        },
                        close: {
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: i18n_1.i18n.t('Close'),
                                emoji: false,
                            },
                            actionId: 'cancel',
                        },
                        blocks,
                    },
                };
            }
        });
    }
}
exports.VideoConfModule = VideoConfModule;
