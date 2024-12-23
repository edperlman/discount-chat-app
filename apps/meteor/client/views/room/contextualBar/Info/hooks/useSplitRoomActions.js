"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSplitRoomActions = void 0;
/**
 *
 * @param room
 * @param options
 * @returns If more than two room actions are enabled `menu.regular` will be a non-empty array
 */
const useSplitRoomActions = (actions, options) => {
    const size = (options === null || options === void 0 ? void 0 : options.size) || 2;
    if (actions.items.length <= size) {
        return { buttons: actions };
    }
    const buttons = { items: actions.items.slice(0, size) };
    const regular = actions.items.slice(size);
    const firstDanger = regular.findIndex((item) => item.variant);
    const danger = regular.splice(firstDanger);
    const menu = [{ items: regular }, { items: danger }];
    return { buttons, menu };
};
exports.useSplitRoomActions = useSplitRoomActions;
