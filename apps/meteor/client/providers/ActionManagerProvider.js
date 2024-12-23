"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const ActionManager_1 = require("../../app/ui-message/client/ActionManager");
const useAppActionButtons_1 = require("../hooks/useAppActionButtons");
const useAppSlashCommands_1 = require("../hooks/useAppSlashCommands");
const useAppUiKitInteraction_1 = require("../hooks/useAppUiKitInteraction");
const useTranslationsForApps_1 = require("../hooks/useTranslationsForApps");
const useInstance_1 = require("../views/room/providers/hooks/useInstance");
const ActionManagerProvider = ({ children }) => {
    const router = (0, ui_contexts_1.useRouter)();
    const actionManager = (0, useInstance_1.useInstance)(() => [new ActionManager_1.ActionManager(router)], [router]);
    (0, useTranslationsForApps_1.useTranslationsForApps)();
    (0, useAppActionButtons_1.useAppActionButtons)();
    (0, useAppSlashCommands_1.useAppSlashCommands)();
    (0, useAppUiKitInteraction_1.useAppUiKitInteraction)(actionManager.handleServerInteraction.bind(actionManager));
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.ActionManagerContext.Provider, { value: actionManager, children: children });
};
exports.default = ActionManagerProvider;
