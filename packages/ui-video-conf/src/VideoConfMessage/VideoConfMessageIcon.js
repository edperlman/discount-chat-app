"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const styles = {
    ended: {
        icon: 'phone-off',
        color: fuselage_1.Palette.text['font-hint'].toString(),
        backgroundColor: fuselage_1.Palette.surface['surface-neutral'].toString(),
    },
    incoming: {
        icon: 'phone-in',
        color: fuselage_1.Palette.statusColor['status-font-on-info'].toString(),
        backgroundColor: fuselage_1.Palette.status['status-background-info'].toString(),
    },
    outgoing: {
        icon: 'phone',
        color: fuselage_1.Palette.statusColor['status-font-on-success'].toString(),
        backgroundColor: fuselage_1.Palette.status['status-background-success'].toString(),
    },
};
const VideoConfMessageIcon = ({ variant = 'ended' }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { size: 'x28', alignItems: 'center', justifyContent: 'center', display: 'flex', borderRadius: 'x4', backgroundColor: styles[variant].backgroundColor, children: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { size: 'x20', name: styles[variant].icon, color: styles[variant].color }) }));
exports.default = VideoConfMessageIcon;
