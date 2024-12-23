"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useParameters = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useParameters = () => {
    const getSetupWizardParameters = (0, ui_contexts_1.useMethod)('getSetupWizardParameters');
    return (0, react_query_1.useQuery)(['setupWizard/parameters'], getSetupWizardParameters, {
        initialData: {
            settings: [],
            serverAlreadyRegistered: false,
        },
    });
};
exports.useParameters = useParameters;
