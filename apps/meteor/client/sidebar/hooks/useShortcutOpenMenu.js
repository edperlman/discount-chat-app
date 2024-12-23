"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useShortcutOpenMenu = void 0;
const react_1 = require("react");
const tinykeys_1 = __importDefault(require("tinykeys"));
// used to open the menu option by keyboard
const useShortcutOpenMenu = (ref) => {
    (0, react_1.useEffect)(() => {
        const unsubscribe = (0, tinykeys_1.default)(ref.current, {
            Alt: (event) => {
                var _a;
                if (!event.target.className.includes('rcx-sidebar-item')) {
                    return;
                }
                event.preventDefault();
                (_a = event.target.querySelector('button')) === null || _a === void 0 ? void 0 : _a.click();
            },
        });
        return () => {
            unsubscribe();
        };
    }, [ref]);
};
exports.useShortcutOpenMenu = useShortcutOpenMenu;
