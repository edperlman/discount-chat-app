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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRegistrationData = saveRegistrationData;
exports.saveRegistrationDataManual = saveRegistrationDataManual;
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const syncCloudData_1 = require("./syncWorkspace/syncCloudData");
const auditedSettingUpdates_1 = require("../../../../server/settings/lib/auditedSettingUpdates");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_1 = require("../../../settings/server");
function saveRegistrationData(_a) {
    return __awaiter(this, arguments, void 0, function* ({ workspaceId, client_name, client_id, client_secret, client_secret_expires_at, publicKey, registration_client_uri, }) {
        yield saveRegistrationDataBase({
            workspaceId,
            client_name,
            client_id,
            client_secret,
            client_secret_expires_at,
            publicKey,
            registration_client_uri,
        });
        yield (0, syncCloudData_1.syncCloudData)();
    });
}
function saveRegistrationDataBase(_a) {
    return __awaiter(this, arguments, void 0, function* ({ workspaceId, client_name, client_id, client_secret, client_secret_expires_at, publicKey, registration_client_uri, }) {
        var _b, e_1, _c, _d;
        const settingsData = [
            { _id: 'Register_Server', value: true },
            { _id: 'Cloud_Workspace_Id', value: workspaceId },
            { _id: 'Cloud_Workspace_Name', value: client_name },
            { _id: 'Cloud_Workspace_Client_Id', value: client_id },
            { _id: 'Cloud_Workspace_Client_Secret', value: client_secret },
            { _id: 'Cloud_Workspace_Client_Secret_Expires_At', value: client_secret_expires_at },
            { _id: 'Cloud_Workspace_PublicKey', value: publicKey },
            { _id: 'Cloud_Workspace_Registration_Client_Uri', value: registration_client_uri },
        ];
        const promises = [
            ...settingsData.map(({ _id, value }) => (0, auditedSettingUpdates_1.updateAuditedBySystem)({
                reason: 'saveRegistrationDataBase',
            })(models_1.Settings.updateValueById, _id, value)),
        ];
        (yield Promise.all(promises)).forEach((value, index) => {
            if (value === null || value === void 0 ? void 0 : value.modifiedCount) {
                void (0, notifyListener_1.notifyOnSettingChangedById)(settingsData[index]._id);
            }
        });
        try {
            // Question: Why is this taking so long that needs a timeout?
            // Answer: we use cache that requires a 'roundtrip' through the db and the application
            // we need to make sure that the cache is updated before we continue the procedures
            // we don't actually need to wait a whole second for this, but look this is just a retry mechanism it doesn't mean that actually takes all this time
            for (var _e = true, _f = __asyncValues(Array.from({ length: 10 })), _g; _g = yield _f.next(), _b = _g.done, !_b; _e = true) {
                _d = _g.value;
                _e = false;
                const retry = _d;
                const isSettingsUpdated = server_1.settings.get('Register_Server') === true &&
                    server_1.settings.get('Cloud_Workspace_Id') === workspaceId &&
                    server_1.settings.get('Cloud_Workspace_Name') === client_name &&
                    server_1.settings.get('Cloud_Workspace_Client_Id') === client_id &&
                    server_1.settings.get('Cloud_Workspace_Client_Secret') === client_secret &&
                    server_1.settings.get('Cloud_Workspace_Client_Secret_Expires_At') === client_secret_expires_at &&
                    server_1.settings.get('Cloud_Workspace_PublicKey') === publicKey &&
                    server_1.settings.get('Cloud_Workspace_Registration_Client_Uri') === registration_client_uri;
                if (isSettingsUpdated) {
                    return;
                }
                if (retry === 9) {
                    throw new Error('Failed to save registration data');
                }
                yield new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_b && (_c = _f.return)) yield _c.call(_f);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
function saveRegistrationDataManual(_a) {
    return __awaiter(this, arguments, void 0, function* ({ workspaceId, client_name, client_id, client_secret, client_secret_expires_at, publicKey, registration_client_uri, licenseData, }) {
        yield saveRegistrationDataBase({
            workspaceId,
            client_name,
            client_id,
            client_secret,
            client_secret_expires_at,
            publicKey,
            registration_client_uri,
        });
        yield (0, license_1.applyLicense)(licenseData.license, true);
    });
}
