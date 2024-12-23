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
exports.createSettings = void 0;
const server_1 = require("../../../../app/settings/server");
const omnichannelEnabledQuery = { _id: 'Livechat_enabled', value: true };
const createSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    yield server_1.settingsRegistry.add('Canned_Responses_Enable', true, {
        group: 'Omnichannel',
        section: 'Canned_Responses',
        type: 'boolean',
        public: true,
        enterprise: true,
        invalidValue: false,
        modules: ['canned-responses'],
        enableQuery: omnichannelEnabledQuery,
    });
});
exports.createSettings = createSettings;
