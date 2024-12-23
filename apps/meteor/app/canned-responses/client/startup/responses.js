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
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const client_1 = require("../../../authorization/client");
const client_2 = require("../../../settings/client");
const SDKClient_1 = require("../../../utils/client/lib/SDKClient");
const CannedResponse_1 = require("../collections/CannedResponse");
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun((c) => __awaiter(void 0, void 0, void 0, function* () {
        if (!meteor_1.Meteor.userId()) {
            return;
        }
        if (!client_2.settings.get('Canned_Responses_Enable')) {
            return;
        }
        if (!(0, client_1.hasPermission)('view-canned-responses')) {
            return;
        }
        tracker_1.Tracker.afterFlush(() => {
            try {
                // TODO: check options
                SDKClient_1.sdk.stream('canned-responses', ['canned-responses'], (...[response, options]) => {
                    const { agentsId } = options || {};
                    if (Array.isArray(agentsId) && !agentsId.includes(meteor_1.Meteor.userId())) {
                        return;
                    }
                    switch (response.type) {
                        case 'changed': {
                            const { type } = response, fields = __rest(response, ["type"]);
                            CannedResponse_1.CannedResponse.upsert({ _id: response._id }, fields);
                            break;
                        }
                        case 'removed': {
                            CannedResponse_1.CannedResponse.remove({ _id: response._id });
                            break;
                        }
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        });
        const { responses } = yield SDKClient_1.sdk.rest.get('/v1/canned-responses.get');
        responses.forEach((response) => CannedResponse_1.CannedResponse.insert(response));
        c.stop();
    }));
});
