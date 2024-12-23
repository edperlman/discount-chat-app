"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_toastbar_1 = require("@rocket.chat/fuselage-toastbar");
const react_1 = require("react");
const ScreenThumbnailWrapper_1 = __importDefault(require("../ScreenThumbnail/ScreenThumbnailWrapper"));
const Thumbnail_1 = __importDefault(require("../ScreenThumbnail/Thumbnail"));
const Context_1 = require("../../Context");
const activeScreenAction_1 = require("../../Context/action/activeScreenAction");
const deleteScreenAction_1 = require("../../Context/action/deleteScreenAction");
const duplicateScreenAction_1 = require("../../Context/action/duplicateScreenAction");
const RenderPayload_1 = __importDefault(require("../RenderPayload/RenderPayload"));
const EditMenu_1 = __importDefault(require("../ScreenThumbnail/EditMenu/EditMenu"));
const ScreenThumbnail = ({ screen, disableDelete, }) => {
    const { dispatch } = (0, react_1.useContext)(Context_1.context);
    const [name, setName] = (0, react_1.useState)(screen === null || screen === void 0 ? void 0 : screen.name);
    const toast = (0, fuselage_toastbar_1.useToastBarDispatch)();
    const activateScreenHandler = (e) => {
        e.stopPropagation();
        dispatch((0, activeScreenAction_1.activeScreenAction)(screen === null || screen === void 0 ? void 0 : screen.id));
    };
    const duplicateScreenHandler = () => {
        dispatch((0, duplicateScreenAction_1.duplicateScreenAction)({ id: screen === null || screen === void 0 ? void 0 : screen.id }));
    };
    const onChangeNameHandler = (e) => {
        setName(e.currentTarget.value);
    };
    const nameSaveHandler = () => {
        if (!name.trim()) {
            setName(screen.name);
            return toast({
                type: 'error',
                message: 'Cannot rename screen to empty name.',
            });
        }
        dispatch((0, Context_1.renameScreenAction)({ id: screen.id, name }));
    };
    const deleteScreenHandler = () => {
        if (disableDelete)
            return toast({
                type: 'info',
                message: 'Cannot delete last screen.',
            });
        dispatch((0, deleteScreenAction_1.deleteScreenAction)(screen === null || screen === void 0 ? void 0 : screen.id));
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: "relative", children: [(0, jsx_runtime_1.jsx)(EditMenu_1.default, { name: name, date: screen.date, onChange: onChangeNameHandler, onDuplicate: duplicateScreenHandler, onDelete: deleteScreenHandler, onBlur: nameSaveHandler, labelProps: { fontScale: 'h5' } }), (0, jsx_runtime_1.jsx)(ScreenThumbnailWrapper_1.default, { onClick: activateScreenHandler, children: (0, jsx_runtime_1.jsx)(Thumbnail_1.default, { of: (0, RenderPayload_1.default)({ blocks: screen.payload.blocks }) }) })] }));
};
exports.default = ScreenThumbnail;
