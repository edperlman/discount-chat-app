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
exports.AppSettingBridge = void 0;
const ServerSettingBridge_1 = require("@rocket.chat/apps-engine/server/bridges/ServerSettingBridge");
const models_1 = require("@rocket.chat/models");
const auditedSettingUpdates_1 = require("../../../../server/settings/lib/auditedSettingUpdates");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
class AppSettingBridge extends ServerSettingBridge_1.ServerSettingBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    getAll(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is getting all the settings.`);
            const settings = yield models_1.Settings.find({ secret: false }).toArray();
            return settings.map((s) => { var _a; return (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('settings').convertToApp(s); });
        });
    }
    getOneById(id, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting the setting by id ${id}.`);
            if (!(yield this.isReadableById(id, appId))) {
                throw new Error(`The setting "${id}" is not readable.`);
            }
            return (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('settings').convertById(id);
        });
    }
    hideGroup(name, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is hidding the group ${name}.`);
            throw new Error('Method not implemented.');
        });
    }
    hideSetting(id, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is hidding the setting ${id}.`);
            if (!(yield this.isReadableById(id, appId))) {
                throw new Error(`The setting "${id}" is not readable.`);
            }
            throw new Error('Method not implemented.');
        });
    }
    isReadableById(id, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is checking if they can read the setting ${id}.`);
            const setting = yield models_1.Settings.findOneById(id);
            return Boolean(setting && !setting.secret);
        });
    }
    updateOne(setting, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is updating the setting ${setting.id} .`);
            if (!(yield this.isReadableById(setting.id, appId))) {
                throw new Error(`The setting "${setting.id}" is not readable.`);
            }
            if ((yield (0, auditedSettingUpdates_1.updateAuditedByApp)({
                _id: appId,
            })(models_1.Settings.updateValueById, setting.id, setting.value)).modifiedCount) {
                void (0, notifyListener_1.notifyOnSettingChangedById)(setting.id);
            }
        });
    }
    incrementValue(id, value, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is incrementing the value of the setting ${id}.`);
            if (!(yield this.isReadableById(id, appId))) {
                throw new Error(`The setting "${id}" is not readable.`);
            }
            const { value: setting } = yield models_1.Settings.incrementValueById(id, value, { returnDocument: 'after' });
            if (setting) {
                void (0, notifyListener_1.notifyOnSettingChanged)(setting);
            }
        });
    }
}
exports.AppSettingBridge = AppSettingBridge;
