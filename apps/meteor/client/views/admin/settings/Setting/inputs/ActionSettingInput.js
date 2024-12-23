"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
function ActionSettingInput({ _id, actionText, value, disabled, sectionChanged }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const actionMethod = (0, ui_contexts_1.useMethod)(value);
    const handleClick = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield actionMethod();
            const params = data.params || [];
            dispatchToastMessage({ type: 'success', message: t(data.message, { postProcess: 'sprintf', sprintf: params }) });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { "data-qa-setting-id": _id, disabled: disabled || sectionChanged, primary: true, onClick: handleClick, children: t(actionText) }) }), sectionChanged && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('Save_to_enable_this_action') })] }));
}
exports.default = ActionSettingInput;
