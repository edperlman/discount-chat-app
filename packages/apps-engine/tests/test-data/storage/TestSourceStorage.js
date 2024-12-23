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
exports.TestSourceStorage = void 0;
const storage_1 = require("../../../src/server/storage");
class TestSourceStorage extends storage_1.AppSourceStorage {
    store(item, zip) {
        return __awaiter(this, void 0, void 0, function* () {
            return 'app_package_path';
        });
    }
    fetch(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return Buffer.from('buffer');
        });
    }
    update(item, zip) {
        return __awaiter(this, void 0, void 0, function* () {
            return 'updated_path';
        });
    }
    remove(item) {
        return __awaiter(this, void 0, void 0, function* () {
            // yup
        });
    }
}
exports.TestSourceStorage = TestSourceStorage;
