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
exports.findOneIntegration = void 0;
const models_1 = require("@rocket.chat/models");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const hasIntegrationsPermission = (userId, integration) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const type = integration.type === 'webhook-incoming' ? 'incoming' : 'outgoing';
    if (yield (0, hasPermission_1.hasPermissionAsync)(userId, `manage-${type}-integrations`)) {
        return true;
    }
    if (userId === ((_a = integration._createdBy) === null || _a === void 0 ? void 0 : _a._id)) {
        return (0, hasPermission_1.hasPermissionAsync)(userId, `manage-own-${type}-integrations`);
    }
    return false;
});
const findOneIntegration = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, integrationId, createdBy, }) {
    const integration = yield models_1.Integrations.findOneByIdAndCreatedByIfExists({
        _id: integrationId,
        createdBy,
    });
    if (!integration) {
        throw new Error('The integration does not exists.');
    }
    if (!(yield hasIntegrationsPermission(userId, integration))) {
        throw new Error('not-authorized');
    }
    return integration;
});
exports.findOneIntegration = findOneIntegration;
