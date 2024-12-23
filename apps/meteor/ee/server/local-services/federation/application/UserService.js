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
exports.FederationUserServiceEE = void 0;
const AbstractFederationApplicationServiceEE_1 = require("./AbstractFederationApplicationServiceEE");
const DEFAULT_SERVERS = [
    {
        name: 'matrix.org',
        default: true,
        local: false,
    },
    {
        name: 'gitter.im',
        default: true,
        local: false,
    },
    {
        name: 'libera.chat',
        default: true,
        local: false,
    },
];
class FederationUserServiceEE extends AbstractFederationApplicationServiceEE_1.AbstractFederationApplicationServiceEE {
    constructor(internalSettingsAdapter, internalFileAdapter, internalUserAdapter, bridge) {
        super(bridge, internalUserAdapter, internalFileAdapter, internalSettingsAdapter);
        this.internalSettingsAdapter = internalSettingsAdapter;
        this.internalFileAdapter = internalFileAdapter;
        this.internalUserAdapter = internalUserAdapter;
        this.bridge = bridge;
        this.availableServers = [
            {
                name: this.internalHomeServerDomain,
                default: true,
                local: true,
            },
            ...DEFAULT_SERVERS,
        ];
    }
    getSearchedServerNamesByInternalUserId(internalUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.internalSettingsAdapter.isFederationEnabled()) {
                throw new Error('Federation is disabled');
            }
            const searchedServersByUser = yield this.internalUserAdapter.getSearchedServerNamesByUserId(internalUserId);
            return [...this.availableServers, ...searchedServersByUser.map((server) => ({ name: server, default: false, local: false }))];
        });
    }
    addSearchedServerNameByInternalUserId(internalUserId, serverName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.internalSettingsAdapter.isFederationEnabled()) {
                throw new Error('Federation is disabled');
            }
            if (this.availableServers.some((server) => server.name === serverName)) {
                throw new Error('already-a-default-server');
            }
            yield this.bridge.searchPublicRooms({
                serverName,
            });
            yield this.internalUserAdapter.addServerNameToSearchedServerNamesListByUserId(internalUserId, serverName);
        });
    }
    removeSearchedServerNameByInternalUserId(internalUserId, serverName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.internalSettingsAdapter.isFederationEnabled()) {
                throw new Error('Federation is disabled');
            }
            if (this.availableServers.some((server) => server.name === serverName)) {
                throw new Error('cannot-remove-default-server');
            }
            const searchedServersByUser = yield this.internalUserAdapter.getSearchedServerNamesByUserId(internalUserId);
            if (!searchedServersByUser.includes(serverName)) {
                throw new Error('server-not-found');
            }
            yield this.internalUserAdapter.removeServerNameFromSearchedServerNamesListByUserId(internalUserId, serverName);
        });
    }
}
exports.FederationUserServiceEE = FederationUserServiceEE;
