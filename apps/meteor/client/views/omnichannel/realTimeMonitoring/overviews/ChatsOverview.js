"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const useEndpointData_1 = require("../../../../hooks/useEndpointData");
const CounterContainer_1 = __importDefault(require("../counter/CounterContainer"));
const initialData = [
    { title: '', value: 0 },
    { title: '', value: '0%' },
    { title: '', value: '00:00:00' },
];
const ChatsOverview = (_a) => {
    var { params, reloadRef } = _a, props = __rest(_a, ["params", "reloadRef"]);
    const { value: data, phase: state, reload } = (0, useEndpointData_1.useEndpointData)('/v1/livechat/analytics/dashboards/chats-totalizers', { params });
    reloadRef.current.chatsOverview = reload;
    return (0, jsx_runtime_1.jsx)(CounterContainer_1.default, Object.assign({ state: state, data: data, initialData: initialData }, props));
};
exports.default = ChatsOverview;
