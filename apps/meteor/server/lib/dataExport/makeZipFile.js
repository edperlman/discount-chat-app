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
exports.makeZipFile = void 0;
const fs_1 = require("fs");
const archiver_1 = __importDefault(require("archiver"));
const makeZipFile = (folderToZip, targetFile) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const output = (0, fs_1.createWriteStream)(targetFile);
        const archive = (0, archiver_1.default)('zip');
        output.on('close', () => resolve());
        archive.on('error', (error) => reject(error));
        archive.pipe(output);
        archive.directory(folderToZip, false);
        yield archive.finalize();
    }));
};
exports.makeZipFile = makeZipFile;
