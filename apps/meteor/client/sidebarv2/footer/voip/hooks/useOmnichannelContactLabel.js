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
exports.useOmnichannelContactLabel = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const parseOutboundPhoneNumber_1 = require("../../../../lib/voip/parseOutboundPhoneNumber");
const useOmnichannelContactLabel = (caller) => {
    const getContactBy = (0, ui_contexts_1.useEndpoint)('GET', '/v1/omnichannel/contact.search');
    const phone = (0, parseOutboundPhoneNumber_1.parseOutboundPhoneNumber)(caller.callerId);
    const { data } = (0, react_query_1.useQuery)(['getContactsByPhone', phone], () => __awaiter(void 0, void 0, void 0, function* () { return getContactBy({ phone }).then(({ contact }) => contact); }), {
        enabled: !!phone,
    });
    return (data === null || data === void 0 ? void 0 : data.name) || caller.callerName || phone;
};
exports.useOmnichannelContactLabel = useOmnichannelContactLabel;
