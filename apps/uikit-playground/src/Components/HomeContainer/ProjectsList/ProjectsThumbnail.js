"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ScreenThumbnailWrapper_1 = __importDefault(require("../../ScreenThumbnail/ScreenThumbnailWrapper"));
const Thumbnail_1 = __importDefault(require("../../ScreenThumbnail/Thumbnail"));
const RenderPayload_1 = __importDefault(require("../../RenderPayload/RenderPayload"));
const Context_1 = require("../../../Context");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const formatDate_1 = require("../../../utils/formatDate");
const EditMenu_1 = __importDefault(require("../../ScreenThumbnail/EditMenu"));
const EditableLabel_1 = __importDefault(require("../../ScreenThumbnail/EditableLabel/EditableLabel"));
const css_in_js_1 = require("@rocket.chat/css-in-js");
const deleteProjectAction_1 = require("../../../Context/action/deleteProjectAction");
const fuselage_toastbar_1 = require("@rocket.chat/fuselage-toastbar");
const Routes_1 = __importDefault(require("../../../Routes/Routes"));
const ProjectsThumbnail = ({ id, name: _name, date, blocks, }) => {
    const [name, setName] = (0, react_1.useState)(_name);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { dispatch } = (0, react_1.useContext)(Context_1.context);
    const toast = (0, fuselage_toastbar_1.useToastBarDispatch)();
    const activeProjectHandler = () => {
        dispatch((0, Context_1.activeProjectAction)(id));
        navigate(`/${id}/${Routes_1.default.project}`);
    };
    const deleteScreenHandler = () => {
        dispatch((0, deleteProjectAction_1.deleteProjectAction)(id));
    };
    const onChangeNameHandler = (e) => {
        setName(e.currentTarget.value);
    };
    const nameSaveHandler = () => {
        if (!name.trim()) {
            setName(_name);
            return toast({
                type: 'error',
                message: 'Cannot rename project to empty name.',
            });
        }
        dispatch((0, Context_1.renameProjectAction)({ id, name }));
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: "flex", flexDirection: "column", className: (0, css_in_js_1.css) `
        gap: 5px;
      `, position: "relative", children: [(0, jsx_runtime_1.jsx)(EditMenu_1.default, { name: name, date: date, onChange: onChangeNameHandler, onDelete: deleteScreenHandler, onBlur: nameSaveHandler, labelProps: { fontScale: 'h5' } }), (0, jsx_runtime_1.jsxs)(ScreenThumbnailWrapper_1.default, { onClick: activeProjectHandler, width: '200px', height: "260px", padding: "30px", children: [(0, jsx_runtime_1.jsx)(Thumbnail_1.default, { of: (0, RenderPayload_1.default)({ blocks }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { onClick: (e) => e.stopPropagation() })] }), (0, jsx_runtime_1.jsx)(EditableLabel_1.default, { value: name, onChange: onChangeNameHandler, fontScale: "h5", onBlur: nameSaveHandler }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, fontScale: "p2", children: (0, formatDate_1.formatDate)(date) })] }));
};
exports.default = ProjectsThumbnail;
