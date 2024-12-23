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
exports.AbstractFederationApplicationServiceEE = void 0;
const AbstractFederationApplicationService_1 = require("../../../../../server/services/federation/application/AbstractFederationApplicationService");
const FederatedUser_1 = require("../domain/FederatedUser");
class AbstractFederationApplicationServiceEE extends AbstractFederationApplicationService_1.AbstractFederationApplicationService {
    constructor(bridge, internalUserAdapter, internalFileAdapter, internalSettingsAdapter) {
        super(bridge, internalUserAdapter, internalFileAdapter, internalSettingsAdapter);
        this.bridge = bridge;
        this.internalUserAdapter = internalUserAdapter;
        this.internalFileAdapter = internalFileAdapter;
        this.internalSettingsAdapter = internalSettingsAdapter;
    }
    createUsersLocallyOnly(invitees) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const externalUsersToBeCreatedLocally = invitees.filter((invitee) => !FederatedUser_1.FederatedUserEE.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(invitee.rawInviteeId), this.internalHomeServerDomain));
            try {
                for (var _d = true, externalUsersToBeCreatedLocally_1 = __asyncValues(externalUsersToBeCreatedLocally), externalUsersToBeCreatedLocally_1_1; externalUsersToBeCreatedLocally_1_1 = yield externalUsersToBeCreatedLocally_1.next(), _a = externalUsersToBeCreatedLocally_1_1.done, !_a; _d = true) {
                    _c = externalUsersToBeCreatedLocally_1_1.value;
                    _d = false;
                    const invitee = _c;
                    const externalUserProfileInformation = yield this.bridge.getUserProfileInformation(invitee.rawInviteeId);
                    const name = (externalUserProfileInformation === null || externalUserProfileInformation === void 0 ? void 0 : externalUserProfileInformation.displayName) || invitee.normalizedInviteeId;
                    const username = invitee.normalizedInviteeId;
                    const existsOnlyOnProxyServer = false;
                    yield this.internalUserAdapter.createLocalUser(FederatedUser_1.FederatedUserEE.createLocalInstanceOnly({
                        username,
                        name,
                        existsOnlyOnProxyServer,
                    }));
                    const federatedUser = yield this.internalUserAdapter.getFederatedUserByExternalId(invitee.rawInviteeId);
                    if (!federatedUser) {
                        return;
                    }
                    yield this.updateUserAvatarInternally(federatedUser, externalUserProfileInformation === null || externalUserProfileInformation === void 0 ? void 0 : externalUserProfileInformation.avatarUrl);
                    yield this.updateUserDisplayNameInternally(federatedUser, externalUserProfileInformation === null || externalUserProfileInformation === void 0 ? void 0 : externalUserProfileInformation.displayName);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = externalUsersToBeCreatedLocally_1.return)) yield _b.call(externalUsersToBeCreatedLocally_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
}
exports.AbstractFederationApplicationServiceEE = AbstractFederationApplicationServiceEE;
