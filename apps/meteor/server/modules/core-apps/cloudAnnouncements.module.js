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
exports.CloudAnnouncementsModule = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const server_1 = require("../../../app/cloud/server");
const syncWorkspace_1 = require("../../../app/cloud/server/functions/syncWorkspace");
const server_2 = require("../../../app/settings/server");
const CloudWorkspaceConnectionError_1 = require("../../../lib/errors/CloudWorkspaceConnectionError");
const InvalidCloudAnnouncementInteractionError_1 = require("../../../lib/errors/InvalidCloudAnnouncementInteractionError");
const InvalidCoreAppInteractionError_1 = require("../../../lib/errors/InvalidCoreAppInteractionError");
const system_1 = require("../../lib/logger/system");
class CloudAnnouncementsModule {
    constructor() {
        this.appId = 'cloud-announcements-core';
    }
    getWorkspaceAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, server_1.getWorkspaceAccessToken)(true);
        });
    }
    getCloudUrl() {
        return server_2.settings.get('Cloud_Url');
    }
    blockAction(payload) {
        return this.handlePayload(payload);
    }
    viewSubmit(payload) {
        return this.handlePayload(payload);
    }
    viewClosed(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { payload: { view: { viewId } = {} }, user: { _id: userId } = {}, } = payload;
            if (!userId) {
                throw new Error('invalid user');
            }
            if (!viewId) {
                throw new Error('invalid view');
            }
            if (!payload.triggerId) {
                throw new Error('invalid triggerId');
            }
            yield core_services_1.Banner.dismiss(userId, viewId);
            const announcement = yield models_1.Banners.findOneById(viewId, { projection: { surface: 1 } });
            const type = (announcement === null || announcement === void 0 ? void 0 : announcement.surface) === 'banner' ? 'banner.close' : 'modal.close';
            // for viewClosed we just need to let Cloud know that the banner was closed, no need to wait for the response
            setImmediate(() => __awaiter(this, void 0, void 0, function* () {
                yield this.handlePayload(payload);
            }));
            return {
                type,
                triggerId: payload.triggerId,
                appId: payload.appId,
                viewId,
            };
        });
    }
    handlePayload(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const interactant = this.getInteractant(payload);
            const interaction = this.getInteraction(payload);
            try {
                const serverInteraction = yield this.pushUserInteraction(interactant, interaction);
                if (serverInteraction.appId !== this.appId) {
                    throw new InvalidCloudAnnouncementInteractionError_1.InvalidCloudAnnouncementInteractionError(`Invalid appId`);
                }
                if (serverInteraction.triggerId !== interaction.triggerId) {
                    throw new InvalidCloudAnnouncementInteractionError_1.InvalidCloudAnnouncementInteractionError(`Invalid triggerId`);
                }
                return serverInteraction;
            }
            catch (error) {
                system_1.SystemLogger.error(error);
            }
        });
    }
    getInteractant(payload) {
        if (payload.user) {
            return {
                user: {
                    _id: payload.user._id,
                    username: payload.user.username,
                    name: payload.user.name,
                },
            };
        }
        if (payload.visitor) {
            return {
                visitor: {
                    id: payload.visitor.id,
                    username: payload.visitor.username,
                    name: payload.visitor.name,
                    department: payload.visitor.department,
                    phone: payload.visitor.phone,
                },
            };
        }
        throw new CloudWorkspaceConnectionError_1.CloudWorkspaceConnectionError(`Invalid user data received from Rocket.Chat Cloud`);
    }
    /**
     * Transform the payload received from the Core App back to the format the UI sends from the client
     */
    getInteraction(payload) {
        var _a, _b;
        if (payload.type === 'blockAction' && ((_a = payload.container) === null || _a === void 0 ? void 0 : _a.type) === 'message') {
            const { actionId, payload: { blockId, value }, message, room, triggerId, } = payload;
            if (!actionId || !blockId || !triggerId) {
                throw new InvalidCoreAppInteractionError_1.InvalidCoreAppInteractionError();
            }
            return {
                type: 'blockAction',
                actionId,
                payload: {
                    blockId,
                    value,
                },
                container: {
                    type: 'message',
                    id: String(message),
                },
                mid: String(message),
                tmid: undefined,
                rid: String(room),
                triggerId,
            };
        }
        if (payload.type === 'blockAction' && ((_b = payload.container) === null || _b === void 0 ? void 0 : _b.type) === 'view') {
            const { actionId, payload: { blockId, value }, container: { id }, triggerId, } = payload;
            if (!actionId || !blockId || !triggerId) {
                throw new InvalidCoreAppInteractionError_1.InvalidCoreAppInteractionError();
            }
            return {
                type: 'blockAction',
                actionId,
                payload: {
                    blockId,
                    value,
                },
                container: {
                    type: 'view',
                    id,
                },
                triggerId,
            };
        }
        if (payload.type === 'viewClosed') {
            const { payload: { view, isCleared }, triggerId, } = payload;
            if (!(view === null || view === void 0 ? void 0 : view.id) || !triggerId) {
                throw new InvalidCoreAppInteractionError_1.InvalidCoreAppInteractionError();
            }
            return {
                type: 'viewClosed',
                payload: {
                    viewId: view.id,
                    view: view,
                    isCleared: Boolean(isCleared),
                },
                triggerId,
            };
        }
        if (payload.type === 'viewSubmit') {
            const { payload: { view }, triggerId, } = payload;
            if (!(view === null || view === void 0 ? void 0 : view.id) || !triggerId) {
                throw new InvalidCoreAppInteractionError_1.InvalidCoreAppInteractionError();
            }
            return {
                type: 'viewSubmit',
                payload: {
                    view: view,
                },
                triggerId,
                viewId: view.id,
            };
        }
        throw new InvalidCoreAppInteractionError_1.InvalidCoreAppInteractionError();
    }
    pushUserInteraction(interactant, userInteraction) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.getWorkspaceAccessToken();
            const request = Object.assign(Object.assign({}, interactant), userInteraction);
            const response = yield (0, server_fetch_1.serverFetch)(`${this.getCloudUrl()}/api/v3/comms/workspace/interaction`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            });
            if (!response.ok) {
                const { error } = yield response.json();
                throw new CloudWorkspaceConnectionError_1.CloudWorkspaceConnectionError(`Failed to connect to Rocket.Chat Cloud: ${error}`);
            }
            const payload = yield response.json();
            const { serverInteraction, serverAction } = payload;
            if (serverAction) {
                switch (serverAction) {
                    case 'syncWorkspace': {
                        yield (0, syncWorkspace_1.syncWorkspace)();
                        break;
                    }
                }
            }
            return serverInteraction;
        });
    }
}
exports.CloudAnnouncementsModule = CloudAnnouncementsModule;
