"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSettingsGroups = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useSettingsGroups = (filter) => {
    const settings = (0, ui_contexts_1.useSettings)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const filterPredicate = (0, react_1.useMemo)(() => {
        if (!filter) {
            return () => true;
        }
        const getMatchableStrings = (setting) => [setting.i18nLabel && t(setting.i18nLabel), t(setting._id), setting._id].filter(Boolean);
        try {
            const filterRegex = new RegExp(filter, 'i');
            return (setting) => getMatchableStrings(setting).some((text) => filterRegex.test(text));
        }
        catch (e) {
            return (setting) => getMatchableStrings(setting).some((text) => text.slice(0, filter.length) === filter);
        }
    }, [filter, t]);
    return (0, react_1.useMemo)(() => {
        const groupIds = Array.from(new Set(settings.filter(filterPredicate).map((setting) => {
            if (setting.type === 'group') {
                return setting._id;
            }
            return setting.group;
        })));
        return settings
            .filter(({ type, group, _id }) => type === 'group' && groupIds.includes(group || _id))
            .sort((a, b) => t((a.i18nLabel || a._id)).localeCompare(t((b.i18nLabel || b._id))));
    }, [settings, filterPredicate, t]);
};
exports.useSettingsGroups = useSettingsGroups;
