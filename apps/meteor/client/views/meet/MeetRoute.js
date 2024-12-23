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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const MeetPage_1 = __importDefault(require("./MeetPage"));
const VisitorDoesNotExistError_1 = require("../../lib/errors/VisitorDoesNotExistError");
const PageLoading_1 = __importDefault(require("../root/PageLoading"));
const MeetRoute = () => {
    var _a;
    const router = (0, ui_contexts_1.useRouter)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const uid = (0, ui_contexts_1.useUserId)();
    const token = (_a = (0, ui_contexts_1.useSearchParameter)('token')) !== null && _a !== void 0 ? _a : '';
    const getVisitorByToken = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/visitor/:token', { token });
    const { data: hasVisitor } = (0, react_query_1.useQuery)(['meet', { token }], () => __awaiter(void 0, void 0, void 0, function* () {
        if (token) {
            const result = yield getVisitorByToken();
            if ('visitor' in result) {
                return true;
            }
            throw new VisitorDoesNotExistError_1.VisitorDoesNotExistError();
        }
        if (!uid) {
            return false;
        }
        return true;
    }), {
        onSuccess: (hasVisitor) => {
            if (hasVisitor === false) {
                router.navigate('/home');
            }
        },
        onError: (error) => {
            if (error instanceof VisitorDoesNotExistError_1.VisitorDoesNotExistError) {
                dispatchToastMessage({ type: 'error', message: t('core.Visitor_does_not_exist') });
                router.navigate('/home');
                return;
            }
            dispatchToastMessage({ type: 'error', message: error });
            router.navigate('/home');
        },
    });
    if (!hasVisitor) {
        return (0, jsx_runtime_1.jsx)(PageLoading_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(MeetPage_1.default, {});
};
exports.default = MeetRoute;
