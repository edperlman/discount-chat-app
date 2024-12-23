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
exports.createThreadSettings = void 0;
const server_1 = require("../../app/settings/server");
const createThreadSettings = () => server_1.settingsRegistry.addGroup('Threads', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.add('Threads_enabled', true, {
            group: 'Threads',
            i18nLabel: 'Enable',
            type: 'boolean',
            public: true,
        });
    });
});
exports.createThreadSettings = createThreadSettings;
