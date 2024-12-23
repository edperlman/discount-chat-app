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
exports.configureOAuth = configureOAuth;
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const cached_1 = require("../../app/settings/server/cached");
const initCustomOAuthServices_1 = require("../lib/oauth/initCustomOAuthServices");
const removeOAuthService_1 = require("../lib/oauth/removeOAuthService");
const updateOAuthServices_1 = require("../lib/oauth/updateOAuthServices");
function configureOAuth() {
    return __awaiter(this, void 0, void 0, function* () {
        const _updateOAuthServices = (0, lodash_debounce_1.default)(updateOAuthServices_1.updateOAuthServices, 2000);
        cached_1.settings.watchByRegex(/^Accounts_OAuth_.+/, () => {
            return _updateOAuthServices();
        });
        cached_1.settings.watchByRegex(/^Accounts_OAuth_Custom-[a-z0-9_]+/, (key, value) => {
            if (!value) {
                return (0, removeOAuthService_1.removeOAuthService)(key);
            }
        });
        yield (0, initCustomOAuthServices_1.initCustomOAuthServices)();
    });
}
