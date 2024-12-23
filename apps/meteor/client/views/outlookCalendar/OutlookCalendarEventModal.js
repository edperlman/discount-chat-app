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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const OutlookEventItemContent_1 = __importDefault(require("./OutlookEventsList/OutlookEventItemContent"));
const useOutlookOpenCall_1 = require("./hooks/useOutlookOpenCall");
const GenericModal_1 = __importDefault(require("../../components/GenericModal"));
const GenericModalSkeleton_1 = __importDefault(require("../../components/GenericModal/GenericModalSkeleton"));
const OutlookCalendarEventModal = (_a) => {
    var { id, subject, meetingUrl, description } = _a, props = __rest(_a, ["id", "subject", "meetingUrl", "description"]);
    const t = (0, ui_contexts_1.useTranslation)();
    const calendarInfoEndpoint = (0, ui_contexts_1.useEndpoint)('GET', '/v1/calendar-events.info');
    const { data, isLoading } = (0, react_query_1.useQuery)(['calendar-events.info', id], () => __awaiter(void 0, void 0, void 0, function* () {
        if (!id) {
            const event = { event: { subject, meetingUrl, description } };
            return event;
        }
        return calendarInfoEndpoint({ id });
    }));
    const openCall = (0, useOutlookOpenCall_1.useOutlookOpenCall)(data === null || data === void 0 ? void 0 : data.event.meetingUrl);
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(GenericModalSkeleton_1.default, Object.assign({}, props));
    }
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, Object.assign({}, props, { tagline: t('Outlook_calendar_event'), icon: null, variant: 'warning', title: data === null || data === void 0 ? void 0 : data.event.subject, cancelText: t('Close'), confirmText: t('Join_call'), onConfirm: openCall, children: (data === null || data === void 0 ? void 0 : data.event.description) ? (0, jsx_runtime_1.jsx)(OutlookEventItemContent_1.default, { html: data === null || data === void 0 ? void 0 : data.event.description }) : t('No_content_was_provided') })));
};
exports.default = OutlookCalendarEventModal;
