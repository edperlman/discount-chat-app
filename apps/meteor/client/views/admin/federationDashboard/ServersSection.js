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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
function ServersSection() {
    const getFederationServers = (0, ui_contexts_1.useMethod)('federation:getServers');
    const result = (0, react_query_1.useQuery)(['admin/federation-dashboard/servers'], () => __awaiter(this, void 0, void 0, function* () { return getFederationServers(); }), {
        refetchInterval: 10000,
    });
    if (result.isLoading) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { alignItems: 'center' });
    }
    if (result.isError || result.data.data.length === 0) {
        return null;
    }
    const servers = result.data.data;
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { withRichContent: true, children: (0, jsx_runtime_1.jsx)("ul", { children: servers.map(({ domain }) => ((0, jsx_runtime_1.jsx)("li", { children: domain }, domain))) }) }));
}
exports.default = ServersSection;
