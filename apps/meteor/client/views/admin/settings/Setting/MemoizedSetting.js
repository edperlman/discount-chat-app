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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const ActionSettingInput_1 = __importDefault(require("./inputs/ActionSettingInput"));
const AssetSettingInput_1 = __importDefault(require("./inputs/AssetSettingInput"));
const BooleanSettingInput_1 = __importDefault(require("./inputs/BooleanSettingInput"));
const CodeSettingInput_1 = __importDefault(require("./inputs/CodeSettingInput"));
const ColorSettingInput_1 = __importDefault(require("./inputs/ColorSettingInput"));
const FontSettingInput_1 = __importDefault(require("./inputs/FontSettingInput"));
const GenericSettingInput_1 = __importDefault(require("./inputs/GenericSettingInput"));
const IntSettingInput_1 = __importDefault(require("./inputs/IntSettingInput"));
const LanguageSettingInput_1 = __importDefault(require("./inputs/LanguageSettingInput"));
const LookupSettingInput_1 = __importDefault(require("./inputs/LookupSettingInput"));
const MultiSelectSettingInput_1 = __importDefault(require("./inputs/MultiSelectSettingInput"));
const PasswordSettingInput_1 = __importDefault(require("./inputs/PasswordSettingInput"));
const RelativeUrlSettingInput_1 = __importDefault(require("./inputs/RelativeUrlSettingInput"));
const RoomPickSettingInput_1 = __importDefault(require("./inputs/RoomPickSettingInput"));
const SelectSettingInput_1 = __importDefault(require("./inputs/SelectSettingInput"));
const SelectTimezoneSettingInput_1 = __importDefault(require("./inputs/SelectTimezoneSettingInput"));
const StringSettingInput_1 = __importDefault(require("./inputs/StringSettingInput"));
const TimespanSettingInput_1 = __importDefault(require("./inputs/TimespanSettingInput"));
// @todo: the props are loosely typed because `Setting` needs to typecheck them.
const inputsByType = {
    boolean: BooleanSettingInput_1.default,
    string: StringSettingInput_1.default,
    relativeUrl: RelativeUrlSettingInput_1.default,
    password: PasswordSettingInput_1.default,
    int: IntSettingInput_1.default,
    select: SelectSettingInput_1.default,
    multiSelect: MultiSelectSettingInput_1.default,
    language: LanguageSettingInput_1.default,
    color: ColorSettingInput_1.default,
    font: FontSettingInput_1.default,
    code: CodeSettingInput_1.default,
    action: ActionSettingInput_1.default,
    asset: AssetSettingInput_1.default,
    roomPick: RoomPickSettingInput_1.default,
    timezone: SelectTimezoneSettingInput_1.default,
    lookup: LookupSettingInput_1.default,
    timespan: TimespanSettingInput_1.default,
    date: GenericSettingInput_1.default, // @todo: implement
    group: GenericSettingInput_1.default, // @todo: implement
};
const MemoizedSetting = (_a) => {
    var { type, hint = undefined, callout = undefined, value = undefined, editor = undefined, onChangeValue, onChangeEditor, disabled, showUpgradeButton, className = undefined, invisible = undefined } = _a, inputProps = __rest(_a, ["type", "hint", "callout", "value", "editor", "onChangeValue", "onChangeEditor", "disabled", "showUpgradeButton", "className", "invisible"]);
    if (invisible) {
        return null;
    }
    const InputComponent = inputsByType[type];
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Field, { className: className, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { flexDirection: 'column', flexGrow: 1, wordBreak: 'break-word', w: 'full', children: [(0, jsx_runtime_1.jsx)(InputComponent, Object.assign({ value: value, hint: hint, editor: editor, onChangeValue: onChangeValue, onChangeEditor: onChangeEditor, disabled: disabled }, inputProps)), hint && type !== 'code' && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: hint }), callout && ((0, jsx_runtime_1.jsx)(fuselage_1.Margins, { block: 16, children: (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'warning', children: callout }) })), showUpgradeButton] }) }));
};
exports.default = (0, react_1.memo)(MemoizedSetting);
