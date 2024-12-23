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
const license_1 = require("@rocket.chat/license");
const isDepartmentCreationAvailable_1 = require("../../../app/livechat/server/lib/isDepartmentCreationAvailable");
isDepartmentCreationAvailable_1.isDepartmentCreationAvailable.patch((next) => __awaiter(void 0, void 0, void 0, function* () {
    // Skip the standard check when Livechat Enterprise is enabled, as it allows unlimited departments
    if (license_1.License.hasModule('livechat-enterprise')) {
        return true;
    }
    return next();
}));
