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
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const tools_1 = require("@rocket.chat/tools");
const server_1 = require("../../../../app/api/server");
const cached_1 = require("../../../../app/settings/server/cached");
server_1.API.v1.addRoute('voip-freeswitch.extension.list', { authRequired: true, permissionsRequired: ['manage-voip-extensions'], validateParams: rest_typings_1.isVoipFreeSwitchExtensionListProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cached_1.settings.get('VoIP_TeamCollab_Enabled')) {
                throw new Error('error-voip-disabled');
            }
            const { username, type = 'all' } = this.queryParams;
            const extensions = yield (0, tools_1.wrapExceptions)(() => core_services_1.VoipFreeSwitch.getExtensionList()).catch(() => {
                throw new Error('error-loading-extension-list');
            });
            if (type === 'all') {
                return server_1.API.v1.success({ extensions });
            }
            const assignedExtensions = yield models_1.Users.findAssignedFreeSwitchExtensions().toArray();
            switch (type) {
                case 'free':
                    const freeExtensions = extensions.filter(({ extension }) => !assignedExtensions.includes(extension));
                    return server_1.API.v1.success({ extensions: freeExtensions });
                case 'allocated':
                    // Extensions that are already assigned to some user
                    const allocatedExtensions = extensions.filter(({ extension }) => assignedExtensions.includes(extension));
                    return server_1.API.v1.success({ extensions: allocatedExtensions });
                case 'available':
                    // Extensions that are free or assigned to the specified user
                    const user = (username && (yield models_1.Users.findOneByUsername(username, { projection: { freeSwitchExtension: 1 } }))) || undefined;
                    const currentExtension = user === null || user === void 0 ? void 0 : user.freeSwitchExtension;
                    const availableExtensions = extensions.filter(({ extension }) => extension === currentExtension || !assignedExtensions.includes(extension));
                    return server_1.API.v1.success({ extensions: availableExtensions });
            }
            return server_1.API.v1.success({ extensions });
        });
    },
});
server_1.API.v1.addRoute('voip-freeswitch.extension.assign', { authRequired: true, permissionsRequired: ['manage-voip-extensions'], validateParams: rest_typings_1.isVoipFreeSwitchExtensionAssignProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cached_1.settings.get('VoIP_TeamCollab_Enabled')) {
                throw new Error('error-voip-disabled');
            }
            const { extension, username } = this.bodyParams;
            if (!username) {
                return server_1.API.v1.notFound();
            }
            const user = yield models_1.Users.findOneByUsername(username, { projection: { freeSwitchExtension: 1 } });
            if (!user) {
                return server_1.API.v1.notFound();
            }
            const existingUser = extension && (yield models_1.Users.findOneByFreeSwitchExtension(extension, { projection: { _id: 1 } }));
            if (existingUser && existingUser._id !== user._id) {
                throw new Error('error-extension-not-available');
            }
            if (extension && user.freeSwitchExtension === extension) {
                return server_1.API.v1.success();
            }
            yield models_1.Users.setFreeSwitchExtension(user._id, extension);
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('voip-freeswitch.extension.getDetails', { authRequired: true, permissionsRequired: ['view-voip-extension-details'], validateParams: rest_typings_1.isVoipFreeSwitchExtensionGetDetailsProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cached_1.settings.get('VoIP_TeamCollab_Enabled')) {
                throw new Error('error-voip-disabled');
            }
            const { extension, group } = this.queryParams;
            if (!extension) {
                throw new Error('error-invalid-params');
            }
            const extensionData = yield (0, tools_1.wrapExceptions)(() => core_services_1.VoipFreeSwitch.getExtensionDetails({ extension, group })).suppress(() => undefined);
            if (!extensionData) {
                return server_1.API.v1.notFound();
            }
            const existingUser = yield models_1.Users.findOneByFreeSwitchExtension(extensionData.extension, { projection: { username: 1, name: 1 } });
            return server_1.API.v1.success(Object.assign(Object.assign({}, extensionData), (existingUser && { userId: existingUser._id, name: existingUser.name, username: existingUser.username })));
        });
    },
});
server_1.API.v1.addRoute('voip-freeswitch.extension.getRegistrationInfoByUserId', { authRequired: true, permissionsRequired: ['view-user-voip-extension'], validateParams: rest_typings_1.isVoipFreeSwitchExtensionGetInfoProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cached_1.settings.get('VoIP_TeamCollab_Enabled')) {
                throw new Error('error-voip-disabled');
            }
            const { userId } = this.queryParams;
            if (!userId) {
                throw new Error('error-invalid-params');
            }
            const user = yield models_1.Users.findOneById(userId, { projection: { freeSwitchExtension: 1 } });
            if (!user) {
                throw new Error('error-user-not-found');
            }
            const { freeSwitchExtension: extension } = user;
            if (!extension) {
                throw new Error('error-extension-not-assigned');
            }
            const extensionData = yield (0, tools_1.wrapExceptions)(() => core_services_1.VoipFreeSwitch.getExtensionDetails({ extension })).suppress(() => undefined);
            if (!extensionData) {
                return server_1.API.v1.notFound('error-registration-not-found');
            }
            const password = yield (0, tools_1.wrapExceptions)(() => core_services_1.VoipFreeSwitch.getUserPassword(extension)).suppress(() => undefined);
            return server_1.API.v1.success({
                extension: extensionData,
                credentials: {
                    websocketPath: cached_1.settings.get('VoIP_TeamCollab_FreeSwitch_WebSocket_Path'),
                    password,
                },
            });
        });
    },
});
