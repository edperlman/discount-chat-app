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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const meteor_1 = require("meteor/meteor");
const object_path_1 = __importDefault(require("object-path"));
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
const slashCommand_1 = require("../../../utils/server/slashCommand");
const api_1 = require("../api");
const getLoggedInUser_1 = require("../helpers/getLoggedInUser");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
api_1.API.v1.addRoute('commands.get', { authRequired: true }, {
    get() {
        const params = this.queryParams;
        if (typeof params.command !== 'string') {
            return api_1.API.v1.failure('The query param "command" must be provided.');
        }
        const cmd = slashCommand_1.slashCommands.commands[params.command.toLowerCase()];
        if (!cmd) {
            return api_1.API.v1.failure(`There is no command in the system by the name of: ${params.command}`);
        }
        return api_1.API.v1.success({ command: cmd });
    },
});
/* @deprecated */
const processQueryOptionsOnResult = (result, options = {}) => {
    if (result === undefined || result === null) {
        return [];
    }
    if (Array.isArray(result)) {
        if (options.sort) {
            result = result.sort((a, b) => {
                let r = 0;
                for (const field in options.sort) {
                    if (options.sort.hasOwnProperty(field)) {
                        const direction = options.sort[field];
                        let valueA;
                        let valueB;
                        if (field.indexOf('.') > -1) {
                            valueA = object_path_1.default.get(a, field);
                            valueB = object_path_1.default.get(b, field);
                        }
                        else {
                            valueA = a[field];
                            valueB = b[field];
                        }
                        if (valueA > valueB) {
                            r = direction;
                            break;
                        }
                        if (valueA < valueB) {
                            r = -direction;
                            break;
                        }
                    }
                }
                return r;
            });
        }
        if (typeof options.skip === 'number') {
            result.splice(0, options.skip);
        }
        if (typeof options.limit === 'number' && options.limit !== 0) {
            result.splice(options.limit);
        }
    }
    const fieldsToRemove = [];
    const fieldsToGet = [];
    if (options.fields) {
        for (const field in Object.keys(options.fields)) {
            if (options.fields.hasOwnProperty(field)) {
                if (options.fields[field] === 0) {
                    fieldsToRemove.push(field);
                }
                else if (options.fields[field] === 1) {
                    fieldsToGet.push(field);
                }
            }
        }
    }
    if (fieldsToGet.length > 0 && fieldsToGet.indexOf('_id') === -1) {
        fieldsToGet.push('_id');
    }
    const pickFields = (obj, fields) => {
        const picked = {};
        fields.forEach((field) => {
            if (String(field).indexOf('.') !== -1) {
                object_path_1.default.set(picked, String(field), object_path_1.default.get(obj, String(field)));
            }
            else {
                picked[field] = obj[field];
            }
        });
        return picked;
    };
    if (fieldsToRemove.length > 0 && fieldsToGet.length > 0) {
        console.warn("Can't mix remove and get fields");
        fieldsToRemove.splice(0, fieldsToRemove.length);
    }
    if (fieldsToRemove.length > 0 || fieldsToGet.length > 0) {
        return result.map((record) => {
            if (fieldsToRemove.length > 0) {
                return Object.fromEntries(Object.entries(record).filter(([key]) => !fieldsToRemove.includes(key)));
            }
            return pickFields(record, fieldsToGet);
        });
    }
    return result;
};
api_1.API.v1.addRoute('commands.list', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = this.queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(params);
            const { sort, query } = yield this.parseJsonQuery();
            let commands = Object.values(slashCommand_1.slashCommands.commands);
            if (query === null || query === void 0 ? void 0 : query.command) {
                commands = commands.filter((command) => command.command === query.command);
            }
            const totalCount = commands.length;
            return api_1.API.v1.success({
                commands: processQueryOptionsOnResult(commands, {
                    sort: sort || { name: 1 },
                    skip: offset,
                    limit: count,
                }),
                offset,
                count: commands.length,
                total: totalCount,
            });
        });
    },
});
// Expects a body of: { command: 'gimme', params: 'any string value', roomId: 'value', triggerId: 'value' }
api_1.API.v1.addRoute('commands.run', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = this.bodyParams;
            if (typeof body.command !== 'string') {
                return api_1.API.v1.failure('You must provide a command to run.');
            }
            if (body.params && typeof body.params !== 'string') {
                return api_1.API.v1.failure('The parameters for the command must be a single string.');
            }
            if (typeof body.roomId !== 'string') {
                return api_1.API.v1.failure("The room's id where to execute this command must be provided and be a string.");
            }
            if (body.tmid && typeof body.tmid !== 'string') {
                return api_1.API.v1.failure('The tmid parameter when provided must be a string.');
            }
            const cmd = body.command.toLowerCase();
            if (!slashCommand_1.slashCommands.commands[cmd]) {
                return api_1.API.v1.failure('The command provided does not exist (or is disabled).');
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(body.roomId, this.userId))) {
                return api_1.API.v1.unauthorized();
            }
            const params = body.params ? body.params : '';
            if (typeof body.tmid === 'string') {
                const thread = yield models_1.Messages.findOneById(body.tmid);
                if (!thread || thread.rid !== body.roomId) {
                    return api_1.API.v1.failure('Invalid thread.');
                }
            }
            const message = Object.assign({ _id: random_1.Random.id(), rid: body.roomId, msg: `/${cmd} ${params}` }, (body.tmid && { tmid: body.tmid }));
            const { triggerId } = body;
            const result = yield slashCommand_1.slashCommands.run({ command: cmd, params, message, triggerId, userId: this.userId });
            return api_1.API.v1.success({ result });
        });
    },
});
api_1.API.v1.addRoute('commands.preview', { authRequired: true }, {
    // Expects these query params: command: 'giphy', params: 'mine', roomId: 'value'
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.queryParams;
            const user = yield (0, getLoggedInUser_1.getLoggedInUser)(this.request);
            if (typeof query.command !== 'string') {
                return api_1.API.v1.failure('You must provide a command to get the previews from.');
            }
            if (query.params && typeof query.params !== 'string') {
                return api_1.API.v1.failure('The parameters for the command must be a single string.');
            }
            if (typeof query.roomId !== 'string') {
                return api_1.API.v1.failure("The room's id where the previews are being displayed must be provided and be a string.");
            }
            const cmd = query.command.toLowerCase();
            if (!slashCommand_1.slashCommands.commands[cmd]) {
                return api_1.API.v1.failure('The command provided does not exist (or is disabled).');
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(query.roomId, user === null || user === void 0 ? void 0 : user._id))) {
                return api_1.API.v1.unauthorized();
            }
            const params = query.params ? query.params : '';
            const preview = yield meteor_1.Meteor.callAsync('getSlashCommandPreviews', {
                cmd,
                params,
                msg: { rid: query.roomId },
            });
            return api_1.API.v1.success({ preview });
        });
    },
    // Expects a body format of: { command: 'giphy', params: 'mine', roomId: 'value', tmid: 'value', triggerId: 'value', previewItem: { id: 'sadf8' type: 'image', value: 'https://dev.null/gif' } }
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = this.bodyParams;
            if (typeof body.command !== 'string') {
                return api_1.API.v1.failure('You must provide a command to run the preview item on.');
            }
            if (body.params && typeof body.params !== 'string') {
                return api_1.API.v1.failure('The parameters for the command must be a single string.');
            }
            if (typeof body.roomId !== 'string') {
                return api_1.API.v1.failure("The room's id where the preview is being executed in must be provided and be a string.");
            }
            if (typeof body.previewItem === 'undefined') {
                return api_1.API.v1.failure('The preview item being executed must be provided.');
            }
            if (!body.previewItem.id || !body.previewItem.type || typeof body.previewItem.value === 'undefined') {
                return api_1.API.v1.failure('The preview item being executed is in the wrong format.');
            }
            if (body.tmid && typeof body.tmid !== 'string') {
                return api_1.API.v1.failure('The tmid parameter when provided must be a string.');
            }
            if (body.triggerId && typeof body.triggerId !== 'string') {
                return api_1.API.v1.failure('The triggerId parameter when provided must be a string.');
            }
            const cmd = body.command.toLowerCase();
            if (!slashCommand_1.slashCommands.commands[cmd]) {
                return api_1.API.v1.failure('The command provided does not exist (or is disabled).');
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(body.roomId, this.userId))) {
                return api_1.API.v1.unauthorized();
            }
            const { params = '' } = body;
            if (body.tmid) {
                const thread = yield models_1.Messages.findOneById(body.tmid);
                if (!thread || thread.rid !== body.roomId) {
                    return api_1.API.v1.failure('Invalid thread.');
                }
            }
            const msg = Object.assign({ rid: body.roomId }, (body.tmid && { tmid: body.tmid }));
            yield meteor_1.Meteor.callAsync('executeSlashCommandPreview', {
                cmd,
                params,
                msg,
            }, body.previewItem, body.triggerId);
            return api_1.API.v1.success();
        });
    },
});
