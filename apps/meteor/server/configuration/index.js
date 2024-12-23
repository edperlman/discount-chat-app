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
exports.configureLoginServices = configureLoginServices;
const accounts_meld_1 = require("./accounts_meld");
const cas_1 = require("./cas");
const ldap_1 = require("./ldap");
const oauth_1 = require("./oauth");
function configureLoginServices() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, accounts_meld_1.configureAccounts)();
        yield (0, cas_1.configureCAS)();
        yield (0, ldap_1.configureLDAP)();
        yield (0, oauth_1.configureOAuth)();
    });
}
