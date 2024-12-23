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
exports.AppContactBridge = void 0;
const bridges_1 = require("@rocket.chat/apps-engine/server/bridges");
const addContactEmail_1 = require("../../../livechat/server/lib/contacts/addContactEmail");
const verifyContactChannel_1 = require("../../../livechat/server/lib/contacts/verifyContactChannel");
class AppContactBridge extends bridges_1.ContactBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    getById(contactId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The app ${appId} is fetching a contact`);
            return this.orch.getConverters().get('contacts').convertById(contactId);
        });
    }
    verifyContact(verifyContactChannelParams, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The app ${appId} is verifing a contact`);
            // Note: If there is more than one app installed, whe should validate the app that called this method to be same one
            //       selected in the setting.
            yield (0, verifyContactChannel_1.verifyContactChannel)(verifyContactChannelParams);
        });
    }
    addContactEmail(contactId, email, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The app ${appId} is adding a new email to the contact`);
            const contact = yield (0, addContactEmail_1.addContactEmail)(contactId, email);
            return this.orch.getConverters().get('contacts').convertContact(contact);
        });
    }
}
exports.AppContactBridge = AppContactBridge;
