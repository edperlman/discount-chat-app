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
exports.MockedSettingsContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const settingContextValue = {
    hasPrivateAccess: true,
    isLoading: false,
    querySetting: (_id) => [() => () => undefined, () => undefined],
    querySettings: () => [() => () => undefined, () => []],
    dispatch: () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }),
};
const createSettingContextValue = ({ settings }) => {
    const cache = new Map();
    return Object.assign(Object.assign({}, settingContextValue), (settings && {
        querySetting: (_id) => [
            () => () => undefined,
            () => {
                if (cache.has(_id)) {
                    return cache.get(_id);
                }
                cache.set(_id, { value: settings[_id] });
                return cache.get(_id);
            },
        ],
    }));
};
const MockedSettingsContext = ({ settings, children, }) => {
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.SettingsContext.Provider, { value: createSettingContextValue({ settings }), children: children });
};
exports.MockedSettingsContext = MockedSettingsContext;
