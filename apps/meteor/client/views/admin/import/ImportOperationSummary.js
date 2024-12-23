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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const ImporterProgressStep_1 = require("../../../../app/importer/lib/ImporterProgressStep");
const useFormatDateAndTime_1 = require("../../../hooks/useFormatDateAndTime");
// TODO: review inner logic
function ImportOperationSummary({ type, _updatedAt, status, file = '', user, small, count: { users = 0, channels = 0, messages = 0, total = 0, contacts = 0 } = {}, valid, }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const fileName = (0, react_1.useMemo)(() => {
        if (!file) {
            return '';
        }
        const fileName = file;
        const userPattern = `_${user}_`;
        const idx = fileName.indexOf(userPattern);
        if (idx >= 0) {
            return fileName.slice(idx + userPattern.length);
        }
        return fileName;
    }, [file, user]);
    const canContinue = (0, react_1.useMemo)(() => valid &&
        [ImporterProgressStep_1.ProgressStep.USER_SELECTION, ...ImporterProgressStep_1.ImportWaitingStates, ...ImporterProgressStep_1.ImportFileReadyStates, ...ImporterProgressStep_1.ImportPreparingStartedStates].includes(status), [valid, status]);
    const canCheckProgress = (0, react_1.useMemo)(() => valid && ImporterProgressStep_1.ImportingStartedStates.includes(status), [valid, status]);
    const router = (0, ui_contexts_1.useRouter)();
    const handleClick = () => {
        if (canContinue) {
            router.navigate('/admin/import/prepare');
            return;
        }
        if (canCheckProgress) {
            router.navigate('/admin/import/progress');
        }
    };
    const hasAction = canContinue || canCheckProgress;
    const props = hasAction
        ? {
            tabIndex: 0,
            role: 'link',
            action: true,
            onClick: handleClick,
        }
        : {};
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.TableRow, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: type }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: formatDateAndTime(_updatedAt) }), !small && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: status && t(status.replace('importer_', 'importer_status_')) }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { children: fileName }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { align: 'center', children: users }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { align: 'center', children: contacts }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { align: 'center', children: channels }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { align: 'center', children: messages }), (0, jsx_runtime_1.jsx)(fuselage_1.TableCell, { align: 'center', children: total })] }))] })));
}
exports.default = ImportOperationSummary;
