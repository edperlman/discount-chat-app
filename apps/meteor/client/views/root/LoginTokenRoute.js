"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const accounts_base_1 = require("meteor/accounts-base");
const react_1 = require("react");
const LoginTokenRoute = () => {
    const router = (0, ui_contexts_1.useRouter)();
    (0, react_1.useEffect)(() => {
        accounts_base_1.Accounts.callLoginMethod({
            methodArguments: [
                {
                    loginToken: router.getRouteParameters().token,
                },
            ],
            userCallback(error) {
                console.error(error);
                router.navigate('/');
            },
        });
    }, [router]);
    return null;
};
exports.default = LoginTokenRoute;
