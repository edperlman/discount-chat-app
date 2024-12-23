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
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashCommands = void 0;
const errors_1 = require("../../../client/lib/errors");
exports.slashCommands = {
    commands: {},
    add({ command, callback, options = {}, result, providesPreview = false, previewer, previewCallback, appId, description = '', }) {
        if (this.commands[command]) {
            return;
        }
        this.commands[command] = {
            command,
            callback,
            params: options.params,
            description: options.description || description,
            permission: options.permission,
            clientOnly: options.clientOnly || false,
            result,
            providesPreview: Boolean(providesPreview),
            previewer,
            previewCallback,
            appId,
        };
    },
    run(_a) {
        return __awaiter(this, arguments, void 0, function* ({ command, message, params, triggerId, userId, }) {
            const cmd = this.commands[command];
            if (typeof (cmd === null || cmd === void 0 ? void 0 : cmd.callback) !== 'function') {
                return;
            }
            if (!(message === null || message === void 0 ? void 0 : message.rid)) {
                throw new errors_1.InvalidCommandUsage();
            }
            return cmd.callback({ command, params, message, triggerId, userId });
        });
    },
    getPreviews(command, params, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const cmd = this.commands[command];
            if (typeof (cmd === null || cmd === void 0 ? void 0 : cmd.previewer) !== 'function') {
                return;
            }
            if (!(message === null || message === void 0 ? void 0 : message.rid)) {
                throw new errors_1.InvalidCommandUsage();
            }
            const previewInfo = yield cmd.previewer(command, params, message);
            if (!((_a = previewInfo === null || previewInfo === void 0 ? void 0 : previewInfo.items) === null || _a === void 0 ? void 0 : _a.length)) {
                return;
            }
            // A limit of ten results, to save time and bandwidth
            if (previewInfo.items.length >= 10) {
                previewInfo.items = previewInfo.items.slice(0, 10);
            }
            return previewInfo;
        });
    },
    executePreview(command, params, message, preview, triggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = this.commands[command];
            if (typeof (cmd === null || cmd === void 0 ? void 0 : cmd.previewCallback) !== 'function') {
                return;
            }
            if (!(message === null || message === void 0 ? void 0 : message.rid)) {
                throw new errors_1.InvalidCommandUsage();
            }
            // { id, type, value }
            if (!preview.id || !preview.type || !preview.value) {
                throw new errors_1.InvalidPreview();
            }
            return cmd.previewCallback(command, params, message, preview, triggerId);
        });
    },
};
