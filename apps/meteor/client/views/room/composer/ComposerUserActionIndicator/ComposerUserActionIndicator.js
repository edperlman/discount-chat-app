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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const UserAction_1 = require("../../../../../app/ui/client/lib/UserAction");
const useReactiveValue_1 = require("../../../../hooks/useReactiveValue");
const maxUsernames = 5;
const ComposerUserActionIndicator = ({ rid, tmid }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const actions = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => {
        const roomAction = UserAction_1.UserAction.get(tmid || rid) || {};
        const activities = Object.entries(roomAction);
        return activities
            .map(([key, _users]) => {
            const action = key.split('-')[1];
            const users = Object.keys(_users);
            if (users.length === 0) {
                return;
            }
            return {
                action,
                users,
            };
        })
            .filter(Boolean);
    }, [rid, tmid]));
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { h: 'x20', className: 'rc-message-box__activity-wrapper', fontScale: 'c1', color: 'annotation', "aria-live": 'polite', display: 'flex', alignItems: 'center', children: actions.map(({ action, users }, index) => ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [index > 0 && ', ', users.length < maxUsernames
                    ? users.join(', ')
                    : `${users.slice(0, maxUsernames - 1).join(', ')} ${t('and')} ${t('others')}`, ' ', users.length > 1 ? t(`are_${action}`) : t(`is_${action}`)] }, action))) }));
};
exports.default = ComposerUserActionIndicator;
