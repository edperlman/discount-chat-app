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
const preact_router_1 = require("preact-router");
const hooks_1 = require("preact/hooks");
const react_i18next_1 = require("react-i18next");
const store_1 = require("../../store");
const component_1 = __importDefault(require("./component"));
const GDPRContainer = ({ ref, t }) => {
    const { config: { messages: { dataProcessingConsentText: consentText = '' } = {} } = {}, dispatch } = (0, hooks_1.useContext)(store_1.StoreContext);
    const handleAgree = () => __awaiter(void 0, void 0, void 0, function* () {
        yield dispatch({ gdpr: { accepted: true } });
        (0, preact_router_1.route)('/');
    });
    return (0, jsx_runtime_1.jsx)(component_1.default, { ref: ref, title: t('gdpr'), dispatch: dispatch, consentText: consentText, onAgree: handleAgree });
};
exports.default = (0, react_i18next_1.withTranslation)()(GDPRContainer);
