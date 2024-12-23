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
exports.TestsCommandBridge = void 0;
const bridges_1 = require("../../../src/server/bridges");
const utilities_1 = require("../utilities");
class TestsCommandBridge extends bridges_1.CommandBridge {
    constructor() {
        super();
        this.commands = new Map();
        this.commands.set('it-exists', utilities_1.TestData.getSlashCommand('it-exists').executor);
    }
    doesCommandExist(command, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.commands.has(command);
        });
    }
    enableCommand(command, appId) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    disableCommand(command, appId) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    modifyCommand(command, appId) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    restoreCommand(comand, appId) { }
    registerCommand(command, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.commands.has(command.command)) {
                throw new Error(`Command "${command.command}" has already been registered.`);
            }
            this.commands.set(command.command, command.executor);
        });
    }
    unregisterCommand(command, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.commands.delete(command);
        });
    }
}
exports.TestsCommandBridge = TestsCommandBridge;
