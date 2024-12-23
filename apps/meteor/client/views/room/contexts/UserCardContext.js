"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserCard = exports.UserCardContext = void 0;
const react_1 = require("react");
exports.UserCardContext = (0, react_1.createContext)({
    openUserCard: () => undefined,
    closeUserCard: () => undefined,
    triggerProps: {},
    triggerRef: { current: null },
    state: { isOpen: false, setOpen: () => undefined, open: () => undefined, close: () => undefined, toggle: () => undefined },
});
const useUserCard = () => (0, react_1.useContext)(exports.UserCardContext);
exports.useUserCard = useUserCard;
