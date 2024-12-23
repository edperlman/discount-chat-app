"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_ui_kit_1 = require("@rocket.chat/fuselage-ui-kit");
const constant_1 = require("../Preview/Display/Surface/constant");
const RenderPayload = ({ blocks, surface = constant_1.SurfaceOptions.Message, }) => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [constant_1.SurfaceOptions.Message === surface && (0, fuselage_ui_kit_1.UiKitMessage)(blocks), constant_1.SurfaceOptions.Banner === surface && (0, fuselage_ui_kit_1.UiKitBanner)(blocks), constant_1.SurfaceOptions.Modal === surface && (0, fuselage_ui_kit_1.UiKitModal)(blocks), constant_1.SurfaceOptions.ContextualBar === surface && (0, fuselage_ui_kit_1.UiKitContextualBar)(blocks)] }));
exports.default = RenderPayload;
