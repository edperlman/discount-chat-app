"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCollapsedGroups = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const useCollapsedGroups = () => {
    const [collapsedGroups, setCollapsedGroups] = (0, fuselage_hooks_1.useLocalStorage)('sidebarGroups', []);
    const handleClick = (0, react_1.useCallback)((group) => {
        if (collapsedGroups.includes(group)) {
            setCollapsedGroups(collapsedGroups.filter((item) => item !== group));
        }
        else {
            setCollapsedGroups([...collapsedGroups, group]);
        }
    }, [collapsedGroups, setCollapsedGroups]);
    const handleKeyDown = (0, react_1.useCallback)((event, group) => {
        if (['Enter', 'Space'].includes(event.code)) {
            event.preventDefault();
            handleClick(group);
        }
    }, [handleClick]);
    return { collapsedGroups, handleClick, handleKeyDown };
};
exports.useCollapsedGroups = useCollapsedGroups;
