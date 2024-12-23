"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_ui_kit_1 = require("@rocket.chat/fuselage-ui-kit");
const react_1 = require("react");
const Context_1 = require("../../../../Context");
const generateActionPreview_1 = __importDefault(require("../../../../Payload/actionPreview/generateActionPreview"));
const DraggableList_1 = __importDefault(require("../../../Draggable/DraggableList"));
const Reorder_1 = require("./Reorder");
const SurfaceRender_1 = __importDefault(require("./SurfaceRender"));
const constant_1 = require("./constant");
const Surface = () => {
    var _a, _b, _c, _d, _e, _f, _g;
    const { state: { screens, activeScreen, user }, dispatch, } = (0, react_1.useContext)(Context_1.context);
    const [uniqueBlocks, setUniqueBlocks] = (0, react_1.useState)({
        block: (_c = (_b = (_a = screens[activeScreen]) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.blocks) === null || _c === void 0 ? void 0 : _c.map((block, i) => ({
            id: `${i}`,
            payload: block,
        })),
        isChangeByDnd: false,
    });
    const preview = (0, generateActionPreview_1.default)({
        type: 'Action Block',
        data: {},
        surface: (_d = screens[activeScreen]) === null || _d === void 0 ? void 0 : _d.payload.surface,
        blocks: (_e = screens[activeScreen]) === null || _e === void 0 ? void 0 : _e.payload.blocks,
        user: user,
    });
    (0, react_1.useEffect)(() => {
        var _a, _b, _c;
        setUniqueBlocks({
            block: (_c = (_b = (_a = screens[activeScreen]) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.blocks) === null || _c === void 0 ? void 0 : _c.map((block, i) => ({
                id: `${i}`,
                payload: block,
            })),
            isChangeByDnd: false,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [(_f = screens[activeScreen]) === null || _f === void 0 ? void 0 : _f.payload.blocks]);
    (0, react_1.useEffect)(() => {
        if (uniqueBlocks.isChangeByDnd) {
            dispatch((0, Context_1.updatePayloadAction)({
                blocks: uniqueBlocks.block.map((block) => block.payload),
                changedByEditor: false,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uniqueBlocks]);
    const onDragEnd = ({ destination, source }) => {
        if (!destination)
            return;
        const newBlocks = (0, Reorder_1.reorder)(uniqueBlocks.block, source.index, destination.index);
        setUniqueBlocks({ block: newBlocks, isChangeByDnd: true });
    };
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: "100%", h: "100%", padding: "20px", children: (0, jsx_runtime_1.jsx)(fuselage_ui_kit_1.UiKitContext.Provider, { value: {
                action: (a) => {
                    preview.action = a;
                    dispatch((0, Context_1.actionPreviewAction)(Object.assign({}, preview)));
                },
                updateState: (s) => {
                    preview.state = s;
                    dispatch((0, Context_1.actionPreviewAction)(Object.assign({}, preview)));
                },
                values: {},
                appId: 'core',
            }, children: (0, jsx_runtime_1.jsx)(SurfaceRender_1.default, { type: (_g = screens[activeScreen]) === null || _g === void 0 ? void 0 : _g.payload.surface, children: (0, jsx_runtime_1.jsx)(DraggableList_1.default, { surface: constant_1.SurfaceOptions.Modal, blocks: uniqueBlocks.block || [], onDragEnd: onDragEnd }) }) }) }));
};
exports.default = Surface;
