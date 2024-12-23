"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRouteLock = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useRouteLock = () => {
    const [locked, setLocked] = (0, react_1.useState)(true);
    const setupWizardState = (0, ui_contexts_1.useSetting)('Show_Setup_Wizard');
    const userId = (0, ui_contexts_1.useUserId)();
    const user = (0, fuselage_hooks_1.useDebouncedValue)((0, ui_contexts_1.useUser)(), 100);
    const hasAdminRole = (0, ui_contexts_1.useRole)('admin');
    const router = (0, ui_contexts_1.useRouter)();
    (0, react_1.useEffect)(() => {
        if (!setupWizardState) {
            return;
        }
        if (userId && !(user === null || user === void 0 ? void 0 : user.status)) {
            return;
        }
        const isComplete = setupWizardState === 'completed';
        const noUserLoggedInAndIsNotPending = locked && !user && setupWizardState !== 'pending';
        const userIsLoggedInButIsNotAdmin = !!user && !hasAdminRole;
        const mustRedirect = isComplete || noUserLoggedInAndIsNotPending || userIsLoggedInButIsNotAdmin;
        if (mustRedirect) {
            router.navigate('/home');
            return;
        }
        setLocked(false);
    }, [router, setupWizardState, userId, user, hasAdminRole, locked]);
    return locked;
};
exports.useRouteLock = useRouteLock;
