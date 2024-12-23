"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useComposerBoxPopupQueries = void 0;
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const useEnablePopupPreview_1 = require("./useEnablePopupPreview");
const slashCommand_1 = require("../../../../../app/utils/client/slashCommand");
const useComposerBoxPopupQueries = (filter, popup) => {
    const [counter, setCounter] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        setCounter(0);
    }, [popup, filter]);
    const shouldPopupPreview = (0, useEnablePopupPreview_1.useEnablePopupPreview)(filter, popup);
    const enableQuery = !popup ||
        (popup.preview &&
            Boolean(slashCommand_1.slashCommands.commands[filter === null || filter === void 0 ? void 0 : filter.cmd]) &&
            slashCommand_1.slashCommands.commands[filter === null || filter === void 0 ? void 0 : filter.cmd].providesPreview) ||
        shouldPopupPreview;
    return {
        queries: (0, react_query_1.useQueries)({
            queries: [
                (popup === null || popup === void 0 ? void 0 : popup.getItemsFromLocal) && {
                    keepPreviousData: true,
                    queryKey: ['message-popup', 'local', filter, popup],
                    queryFn: () => (popup === null || popup === void 0 ? void 0 : popup.getItemsFromLocal) && popup.getItemsFromLocal(filter),
                    onSuccess: (args) => {
                        if (args.length < 5) {
                            setCounter(1);
                        }
                    },
                    enabled: enableQuery,
                },
                (popup === null || popup === void 0 ? void 0 : popup.getItemsFromServer) && {
                    keepPreviousData: true,
                    queryKey: ['message-popup', 'server', filter, popup],
                    queryFn: () => (popup === null || popup === void 0 ? void 0 : popup.getItemsFromServer) && popup.getItemsFromServer(filter),
                    enabled: counter > 0,
                },
            ].filter(Boolean),
        }),
        suspended: !enableQuery,
    };
};
exports.useComposerBoxPopupQueries = useComposerBoxPopupQueries;
