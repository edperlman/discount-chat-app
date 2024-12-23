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
exports.formatAppInstanceForRest = formatAppInstanceForRest;
const getInstallationSourceFromAppStorageItem_1 = require("../../../lib/apps/getInstallationSourceFromAppStorageItem");
function formatAppInstanceForRest(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const appRest = Object.assign(Object.assign({}, app.getInfo()), { status: yield app.getStatus(), languages: app.getStorageItem().languageContent, private: (0, getInstallationSourceFromAppStorageItem_1.getInstallationSourceFromAppStorageItem)(app.getStorageItem()) === 'private', migrated: !!app.getStorageItem().migrated });
        const licenseValidation = app.getLatestLicenseValidationResult();
        if ((licenseValidation === null || licenseValidation === void 0 ? void 0 : licenseValidation.hasErrors) || (licenseValidation === null || licenseValidation === void 0 ? void 0 : licenseValidation.hasWarnings)) {
            appRest.licenseValidation = licenseValidation;
        }
        return appRest;
    });
}
