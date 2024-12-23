"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEmailVerificationWarning = useEmailVerificationWarning;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
function useEmailVerificationWarning(user) {
    var _a;
    const emailVerificationEnabled = (0, ui_contexts_1.useSetting)('Accounts_EmailVerification', false);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const mainEmail = (_a = user === null || user === void 0 ? void 0 : user.emails) === null || _a === void 0 ? void 0 : _a[0];
    const warnedRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        const { current: warned } = warnedRef;
        if (mainEmail && mainEmail.verified !== true && emailVerificationEnabled && !warned) {
            dispatchToastMessage({
                type: 'warning',
                message: t('core.You_have_not_verified_your_email'),
            });
            warnedRef.current = true;
        }
    }, [mainEmail, emailVerificationEnabled, dispatchToastMessage, t]);
}
