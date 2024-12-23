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
exports.useClearUnreadAllMessagesMutation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("../../../../app/models/client");
const useClearUnreadAllMessagesMutation = (options) => {
    const readSubscription = (0, ui_contexts_1.useEndpoint)('POST', '/v1/subscriptions.read');
    return (0, react_query_1.useMutation)(() => __awaiter(void 0, void 0, void 0, function* () {
        const promises = client_1.Subscriptions.find({
            open: true,
        }, {
            fields: {
                unread: 1,
                alert: 1,
                rid: 1,
                t: 1,
                name: 1,
                ls: 1,
            },
        }).map((subscription) => {
            if (subscription.alert || subscription.unread > 0) {
                return readSubscription({ rid: subscription.rid, readThreads: true });
            }
            return Promise.resolve();
        });
        yield Promise.all(promises);
    }), options);
};
exports.useClearUnreadAllMessagesMutation = useClearUnreadAllMessagesMutation;
