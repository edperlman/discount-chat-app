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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoomQuery = useRoomQuery;
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const client_1 = require("../../../../../app/models/client");
const queueMicrotask_1 = require("../../../../lib/utils/queueMicrotask");
function useRoomQuery(rid, options) {
    const queryKey = ['rooms', rid];
    const queryResult = (0, react_query_1.useQuery)(queryKey, () => __awaiter(this, void 0, void 0, function* () { var _a; return (_a = client_1.Rooms.findOne({ _id: rid }, { reactive: false })) !== null && _a !== void 0 ? _a : null; }), Object.assign({ staleTime: Infinity }, options));
    const { refetch } = queryResult;
    (0, react_1.useEffect)(() => {
        const liveQueryHandle = client_1.Rooms.find({ _id: rid }).observe({
            added: () => (0, queueMicrotask_1.queueMicrotask)(() => refetch({ exact: false })),
            changed: () => (0, queueMicrotask_1.queueMicrotask)(() => refetch({ exact: false })),
            removed: () => (0, queueMicrotask_1.queueMicrotask)(() => refetch({ exact: false })),
        });
        return () => {
            liveQueryHandle.stop();
        };
    }, [refetch, rid]);
    return queryResult;
}
