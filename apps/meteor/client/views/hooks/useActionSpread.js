"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useActionSpread = void 0;
const react_1 = require("react");
const mapOptions = ([key, { action, label, icon }]) => [
    key,
    {
        label: { label, icon }, // TODO fuselage
        action,
    },
];
const useActionSpread = (actions, size = 2) => (0, react_1.useMemo)(() => {
    const entries = Object.entries(actions);
    const options = entries.slice(0, size);
    const menuOptions = entries.slice(size, entries.length).map(mapOptions);
    const menu = menuOptions.length ? Object.fromEntries(menuOptions) : undefined;
    return { actions: options, menu };
}, [actions, size]);
exports.useActionSpread = useActionSpread;
