"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuditTab = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const typeToTabMap = {
    '': 'rooms',
    'u': 'users',
    'd': 'direct',
    'l': 'omnichannel',
};
const tabToTabMap = new Map(Object.entries(typeToTabMap).map(([type, tab]) => [tab, type]));
const useAuditTab = () => {
    const tab = (0, ui_contexts_1.useRouteParameter)('tab');
    const type = (0, react_1.useMemo)(() => { var _a; return (_a = tabToTabMap.get(tab !== null && tab !== void 0 ? tab : 'rooms')) !== null && _a !== void 0 ? _a : ''; }, [tab]);
    const auditRoute = (0, ui_contexts_1.useRoute)('audit-home');
    const setType = (0, fuselage_hooks_1.useMutableCallback)((newType) => {
        var _a;
        auditRoute.replace({ tab: (_a = typeToTabMap[typeof newType === 'function' ? newType(type) : newType]) !== null && _a !== void 0 ? _a : 'rooms' });
    });
    return [type, setType];
};
exports.useAuditTab = useAuditTab;
