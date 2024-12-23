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
exports.createDiscussionsSettings = void 0;
const server_1 = require("../../app/settings/server");
const createDiscussionsSettings = () => server_1.settingsRegistry.addGroup('Discussion', function () {
    return __awaiter(this, void 0, void 0, function* () {
        // the channel for which discussions are created if none is explicitly chosen
        yield this.add('Discussion_enabled', true, {
            group: 'Discussion',
            i18nLabel: 'Enable',
            type: 'boolean',
            public: true,
        });
    });
});
exports.createDiscussionsSettings = createDiscussionsSettings;
