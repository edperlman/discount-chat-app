"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTranscriptQuickAction = void 0;
const react_1 = require("react");
const quickActions_1 = require("../../views/room/lib/quickActions");
const useTranscriptQuickAction = () => {
    return (0, react_1.useMemo)(() => ({
        groups: ['live'],
        id: quickActions_1.QuickActionsEnum.Transcript,
        title: 'Send_transcript',
        icon: 'mail-arrow-top-right',
        order: 3,
        options: [
            { label: 'Send_via_email', id: quickActions_1.QuickActionsEnum.TranscriptEmail },
            {
                label: 'Export_as_PDF',
                id: quickActions_1.QuickActionsEnum.TranscriptPDF,
                validate: (room) => ({
                    tooltip: 'Export_enabled_at_the_end_of_the_conversation',
                    value: !(room === null || room === void 0 ? void 0 : room.open),
                }),
            },
        ],
    }), []);
};
exports.useTranscriptQuickAction = useTranscriptQuickAction;
