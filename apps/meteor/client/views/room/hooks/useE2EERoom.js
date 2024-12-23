"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useE2EERoom = void 0;
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("../../../../app/e2e/client");
const useE2EERoom = (rid) => {
    const { data } = (0, react_query_1.useQuery)(['e2eRoom', rid], () => client_1.e2e.getInstanceByRoomId(rid));
    return data;
};
exports.useE2EERoom = useE2EERoom;
