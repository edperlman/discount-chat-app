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
exports.getManifestFromZippedApp = getManifestFromZippedApp;
const fflate_1 = require("fflate");
function fileToUint8Array(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => resolve(new Uint8Array(e.target.result));
            fileReader.onerror = (e) => reject(e);
            fileReader.readAsArrayBuffer(file);
        });
    });
}
function unzipAppBuffer(zippedAppBuffer) {
    return (0, fflate_1.unzipSync)(zippedAppBuffer);
}
function getAppManifest(unzippedAppBuffer) {
    if (!unzippedAppBuffer['app.json']) {
        throw new Error('No app.json file found in the zip');
    }
    try {
        return JSON.parse((0, fflate_1.strFromU8)(unzippedAppBuffer['app.json']));
    }
    catch (e) {
        throw new Error(`Failed to parse app.json: ${e instanceof Error ? e.message : String(e)}`);
    }
}
function unzipZippedApp(zippedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (zippedApp instanceof File) {
                zippedApp = yield fileToUint8Array(zippedApp);
            }
            return unzipAppBuffer(zippedApp);
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    });
}
function getManifestFromZippedApp(zippedApp) {
    return __awaiter(this, void 0, void 0, function* () {
        const unzippedBuffer = yield unzipZippedApp(zippedApp);
        return getAppManifest(unzippedBuffer);
    });
}
