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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const events_1 = require("./events");
const service_1 = require("./service");
const server_1 = require("../../settings/server");
class Search extends core_services_1.ServiceClassInternal {
    constructor() {
        super();
        this.name = 'search';
        this.internal = true;
        this.onEvent('watch.users', (_a) => __awaiter(this, void 0, void 0, function* () {
            var { clientAction, id } = _a, rest = __rest(_a, ["clientAction", "id"]);
            if (clientAction === 'removed') {
                events_1.searchEventService.promoteEvent('user.delete', id, undefined);
                return;
            }
            const user = ('data' in rest && rest.data) || (yield models_1.Users.findOneById(id));
            events_1.searchEventService.promoteEvent('user.save', id, user);
        }));
        this.onEvent('watch.rooms', (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, room }) {
            if (clientAction === 'removed') {
                events_1.searchEventService.promoteEvent('room.delete', room._id, undefined);
                return;
            }
            events_1.searchEventService.promoteEvent('room.save', room._id, room);
        }));
    }
}
const service = new Search();
server_1.settings.watch('Search.Provider', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = service_1.searchProviderService.activeProvider) === null || _a === void 0 ? void 0 : _a.on) {
        core_services_1.api.registerService(service);
    }
    else {
        yield core_services_1.api.destroyService(service);
    }
}));
