"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEditableSettingsDispatch = exports.useEditableSettingsGroupTabs = exports.useEditableSettingsGroupSections = exports.useEditableSettings = exports.useEditableSetting = exports.EditableSettingsContext = void 0;
const react_1 = require("react");
const shim_1 = require("use-sync-external-store/shim");
exports.EditableSettingsContext = (0, react_1.createContext)({
    queryEditableSetting: () => [() => () => undefined, () => undefined],
    queryEditableSettings: () => [() => () => undefined, () => []],
    queryGroupSections: () => [() => () => undefined, () => []],
    queryGroupTabs: () => [() => () => undefined, () => []],
    dispatch: () => undefined,
});
const useEditableSetting = (_id) => {
    const { queryEditableSetting } = (0, react_1.useContext)(exports.EditableSettingsContext);
    const [subscribe, getSnapshot] = (0, react_1.useMemo)(() => queryEditableSetting(_id), [queryEditableSetting, _id]);
    return (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
};
exports.useEditableSetting = useEditableSetting;
const useEditableSettings = (query) => {
    const { queryEditableSettings } = (0, react_1.useContext)(exports.EditableSettingsContext);
    const [subscribe, getSnapshot] = (0, react_1.useMemo)(() => queryEditableSettings(query !== null && query !== void 0 ? query : {}), [queryEditableSettings, query]);
    return (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
};
exports.useEditableSettings = useEditableSettings;
const useEditableSettingsGroupSections = (_id, tab) => {
    const { queryGroupSections } = (0, react_1.useContext)(exports.EditableSettingsContext);
    const [subscribe, getSnapshot] = (0, react_1.useMemo)(() => queryGroupSections(_id, tab), [queryGroupSections, _id, tab]);
    return (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
};
exports.useEditableSettingsGroupSections = useEditableSettingsGroupSections;
const useEditableSettingsGroupTabs = (_id) => {
    const { queryGroupTabs } = (0, react_1.useContext)(exports.EditableSettingsContext);
    const [subscribe, getSnapshot] = (0, react_1.useMemo)(() => queryGroupTabs(_id), [queryGroupTabs, _id]);
    return (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
};
exports.useEditableSettingsGroupTabs = useEditableSettingsGroupTabs;
const useEditableSettingsDispatch = () => (0, react_1.useContext)(exports.EditableSettingsContext).dispatch;
exports.useEditableSettingsDispatch = useEditableSettingsDispatch;
