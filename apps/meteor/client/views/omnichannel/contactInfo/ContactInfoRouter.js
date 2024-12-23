"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const ContactInfo_1 = __importDefault(require("./ContactInfo"));
const ContactInfoError_1 = __importDefault(require("./ContactInfoError"));
const EditContactInfoWithData_1 = __importDefault(require("./EditContactInfoWithData"));
const RoomContext_1 = require("../../room/contexts/RoomContext");
const RoomToolboxContext_1 = require("../../room/contexts/RoomToolboxContext");
const ContactInfoRouter = () => {
    const room = (0, RoomContext_1.useOmnichannelRoom)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const liveRoute = (0, ui_contexts_1.useRoute)('live');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const handleCloseEdit = () => liveRoute.push({ id: room._id, tab: 'contact-profile' });
    if (!room.contactId) {
        return (0, jsx_runtime_1.jsx)(ContactInfoError_1.default, { onClose: closeTab });
    }
    if (context === 'edit' && room.contactId) {
        return (0, jsx_runtime_1.jsx)(EditContactInfoWithData_1.default, { id: room.contactId, onClose: closeTab, onCancel: handleCloseEdit });
    }
    return (0, jsx_runtime_1.jsx)(ContactInfo_1.default, { id: room.contactId, onClose: closeTab });
};
exports.default = ContactInfoRouter;
