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
const supportedVersionsChooseLatest_1 = require("./supportedVersionsChooseLatest");
describe('supportedVersionsChooseLatest', () => {
    test('should return the latest version', () => __awaiter(void 0, void 0, void 0, function* () {
        const versionFromLicense = {
            signed: 'signed____',
            timestamp: '2021-08-31T18:00:00.000Z',
            versions: [],
        };
        const versionFromCloud = {
            signed: 'signed_------',
            timestamp: '2021-08-31T19:00:00.000Z',
            versions: [],
        };
        const result = yield (0, supportedVersionsChooseLatest_1.supportedVersionsChooseLatest)(versionFromLicense, versionFromCloud);
        expect(result.timestamp).toBe(versionFromCloud.timestamp);
    }));
});
