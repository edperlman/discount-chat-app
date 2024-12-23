"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUiKitView = useUiKitView;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const fuselage_ui_kit_1 = require("@rocket.chat/fuselage-ui-kit");
const react_1 = require("react");
const useUiKitActionManager_1 = require("./useUiKitActionManager");
const reduceValues = (values, { actionId, payload }) => (Object.assign(Object.assign({}, values), { [actionId]: payload }));
const getViewId = (view) => {
    if ('id' in view && typeof view.id === 'string') {
        return view.id;
    }
    if ('viewId' in view && typeof view.viewId === 'string') {
        return view.viewId;
    }
    throw new Error('Invalid view');
};
const getViewFromInteraction = (interaction) => {
    if ('view' in interaction && typeof interaction.view === 'object') {
        return interaction.view;
    }
    if (interaction.type === 'banner.open') {
        return interaction;
    }
    return undefined;
};
function useUiKitView(initialView) {
    const [errors, setErrors] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)());
    const [values, updateValues] = (0, fuselage_hooks_1.useSafely)((0, react_1.useReducer)(reduceValues, initialView.blocks, fuselage_ui_kit_1.extractInitialStateFromLayout));
    const [view, updateView] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(initialView));
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    const state = (0, react_1.useMemo)(() => {
        return Object.entries(values).reduce((obj, [key, payload]) => {
            if (!(payload === null || payload === void 0 ? void 0 : payload.blockId)) {
                return obj;
            }
            const { blockId, value } = payload;
            obj[blockId] = obj[blockId] || {};
            obj[blockId][key] = value;
            return obj;
        }, {});
    }, [values]);
    const viewId = getViewId(view);
    (0, react_1.useEffect)(() => {
        const handleUpdate = (interaction) => {
            if (interaction.type === 'errors') {
                setErrors(interaction.errors);
                return;
            }
            updateView((view) => (Object.assign(Object.assign({}, view), getViewFromInteraction(interaction))));
        };
        actionManager.on(viewId, handleUpdate);
        return () => {
            actionManager.off(viewId, handleUpdate);
        };
    }, [actionManager, setErrors, updateView, viewId]);
    return { view, errors, values, updateValues, state };
}
