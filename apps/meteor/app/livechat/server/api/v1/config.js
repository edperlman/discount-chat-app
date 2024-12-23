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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const mem_1 = __importDefault(require("mem"));
const server_1 = require("../../../../api/server");
const server_2 = require("../../../../settings/server");
const LivechatTyped_1 = require("../../lib/LivechatTyped");
const livechat_1 = require("../lib/livechat");
const cachedSettings = (0, mem_1.default)(livechat_1.settings, { maxAge: process.env.TEST_MODE === 'true' ? 1 : 1000, cacheKey: JSON.stringify });
server_1.API.v1.addRoute('livechat/config', { validateParams: rest_typings_1.isGETLivechatConfigParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const enabled = server_2.settings.get('Livechat_enabled');
            if (!enabled) {
                return server_1.API.v1.success({ config: { enabled: false } });
            }
            const { token, department, businessUnit } = this.queryParams;
            const config = yield cachedSettings({ businessUnit });
            const status = yield LivechatTyped_1.Livechat.online(department);
            const guest = token ? yield (0, livechat_1.findGuestWithoutActivity)(token) : null;
            const room = guest ? yield (0, livechat_1.findOpenRoom)(guest.token) : undefined;
            const agent = guest && room && room.servedBy && (yield (0, livechat_1.findAgent)(room.servedBy._id));
            const extra = yield (0, livechat_1.getExtraConfigInfo)(room);
            return server_1.API.v1.success({
                config: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, config), { online: status }), extra), (guest && { guest })), (room && { room })), (agent && { agent })),
            });
        });
    },
});
