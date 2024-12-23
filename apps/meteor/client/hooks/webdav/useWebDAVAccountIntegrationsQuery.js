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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebDAVAccountIntegrationsQuery = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const useWebDAVAccountIntegrationsQuery = (_a = {}) => {
    var { enabled = true } = _a, options = __rest(_a, ["enabled"]);
    const uid = (0, ui_contexts_1.useUserId)();
    const queryKey = (0, react_1.useMemo)(() => ['webdav', 'account-integrations'], []);
    const getMyAccounts = (0, ui_contexts_1.useEndpoint)('GET', '/v1/webdav.getMyAccounts');
    const integrationsQuery = (0, react_query_1.useQuery)(Object.assign({ queryKey, queryFn: () => __awaiter(void 0, void 0, void 0, function* () {
            const { accounts } = yield getMyAccounts();
            return accounts;
        }), enabled: !!uid && enabled, staleTime: Infinity }, options));
    const queryClient = (0, react_query_1.useQueryClient)();
    const subscribeToNotifyUser = (0, ui_contexts_1.useStream)('notify-user');
    (0, react_1.useEffect)(() => {
        if (!uid || !enabled) {
            return;
        }
        return subscribeToNotifyUser(`${uid}/webdav`, ({ type, account }) => {
            switch (type) {
                case 'changed':
                    queryClient.invalidateQueries(queryKey);
                    break;
                case 'removed':
                    queryClient.setQueryData(queryKey, (old = []) => {
                        return old.filter((oldAccount) => oldAccount._id !== account._id);
                    });
                    break;
            }
        });
    }, [enabled, queryClient, queryKey, uid, subscribeToNotifyUser]);
    return integrationsQuery;
};
exports.useWebDAVAccountIntegrationsQuery = useWebDAVAccountIntegrationsQuery;
