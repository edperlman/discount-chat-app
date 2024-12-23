"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const ComposerAirGappedRestricted_1 = __importDefault(require("./ComposerAirGappedRestricted"));
const ComposerAnonymous_1 = __importDefault(require("./ComposerAnonymous"));
const ComposerArchived_1 = __importDefault(require("./ComposerArchived"));
const ComposerBlocked_1 = __importDefault(require("./ComposerBlocked"));
const ComposerFederation_1 = __importDefault(require("./ComposerFederation"));
const ComposerJoinWithPassword_1 = __importDefault(require("./ComposerJoinWithPassword"));
const ComposerMessage_1 = __importDefault(require("./ComposerMessage"));
const ComposerOmnichannel_1 = __importDefault(require("./ComposerOmnichannel"));
const ComposerReadOnly_1 = __importDefault(require("./ComposerReadOnly"));
const ComposerVoIP_1 = __importDefault(require("./ComposerVoIP"));
const RoomContext_1 = require("../contexts/RoomContext");
const useMessageComposerIsAnonymous_1 = require("./hooks/useMessageComposerIsAnonymous");
const useMessageComposerIsArchived_1 = require("./hooks/useMessageComposerIsArchived");
const useMessageComposerIsBlocked_1 = require("./hooks/useMessageComposerIsBlocked");
const useMessageComposerIsReadOnly_1 = require("./hooks/useMessageComposerIsReadOnly");
const useAirGappedRestriction_1 = require("../../../hooks/useAirGappedRestriction");
const ComposerContainer = (_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    const room = (0, RoomContext_1.useRoom)();
    const canJoinWithoutCode = (0, ui_contexts_1.usePermission)('join-without-join-code');
    const mustJoinWithCode = !props.subscription && room.joinCodeRequired && !canJoinWithoutCode;
    const isAnonymous = (0, useMessageComposerIsAnonymous_1.useMessageComposerIsAnonymous)();
    const isBlockedOrBlocker = (0, useMessageComposerIsBlocked_1.useMessageComposerIsBlocked)({ subscription: props.subscription });
    const isArchived = (0, useMessageComposerIsArchived_1.useMessageComposerIsArchived)(room._id, props.subscription);
    const isReadOnly = (0, useMessageComposerIsReadOnly_1.useMessageComposerIsReadOnly)(room._id);
    const isOmnichannel = (0, core_typings_1.isOmnichannelRoom)(room);
    const isFederation = (0, core_typings_1.isRoomFederated)(room);
    const isVoip = (0, core_typings_1.isVoipRoom)(room);
    const [isAirGappedRestricted] = (0, useAirGappedRestriction_1.useAirGappedRestriction)();
    if (isAirGappedRestricted) {
        return (0, jsx_runtime_1.jsx)(ComposerAirGappedRestricted_1.default, {});
    }
    if (isOmnichannel) {
        return (0, jsx_runtime_1.jsx)(ComposerOmnichannel_1.default, Object.assign({}, props));
    }
    if (isVoip) {
        return (0, jsx_runtime_1.jsx)(ComposerVoIP_1.default, {});
    }
    if (isFederation) {
        return (0, jsx_runtime_1.jsx)(ComposerFederation_1.default, Object.assign({}, props));
    }
    if (isAnonymous) {
        return (0, jsx_runtime_1.jsx)(ComposerAnonymous_1.default, {});
    }
    if (isReadOnly) {
        return (0, jsx_runtime_1.jsx)(ComposerReadOnly_1.default, {});
    }
    if (isArchived) {
        return (0, jsx_runtime_1.jsx)(ComposerArchived_1.default, {});
    }
    if (mustJoinWithCode) {
        return (0, jsx_runtime_1.jsx)(ComposerJoinWithPassword_1.default, {});
    }
    if (isBlockedOrBlocker) {
        return (0, jsx_runtime_1.jsx)(ComposerBlocked_1.default, {});
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [children, (0, jsx_runtime_1.jsx)(ComposerMessage_1.default, Object.assign({}, props))] }));
};
exports.default = (0, react_1.memo)(ComposerContainer);
