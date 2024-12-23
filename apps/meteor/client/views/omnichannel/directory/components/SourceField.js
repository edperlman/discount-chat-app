"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const OmnichannelRoomIcon_1 = require("../../../../components/RoomIcon/OmnichannelRoomIcon");
const Field_1 = __importDefault(require("../../components/Field"));
const Info_1 = __importDefault(require("../../components/Info"));
const Label_1 = __importDefault(require("../../components/Label"));
const useOmnichannelSource_1 = require("../../hooks/useOmnichannelSource");
const SourceField = ({ room }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { getSourceName } = (0, useOmnichannelSource_1.useOmnichannelSource)();
    const defaultTypesVisitorData = {
        widget: '',
        email: room === null || room === void 0 ? void 0 : room.source.id,
        sms: t('External'),
        app: room.source.label || t('External'),
        api: room.source.label || t('External'),
        other: t('External'),
    };
    return ((0, jsx_runtime_1.jsxs)(Field_1.default, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { children: t('Channel') }), (0, jsx_runtime_1.jsx)(Info_1.default, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(OmnichannelRoomIcon_1.OmnichannelRoomIcon, { source: room.source, status: room.v.status, size: 'x24' }), (0, jsx_runtime_1.jsx)(Label_1.default, { mi: 8, mbe: '0', children: getSourceName(room.source) }), defaultTypesVisitorData[room.source.type]] }) })] }));
};
exports.default = SourceField;
