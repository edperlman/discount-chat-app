"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.createNpmFile = createNpmFile;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const core = __importStar(require("@actions/core"));
function createNpmFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const userNpmrcPath = `${process.env.HOME}/.npmrc`;
        if (fs_1.default.existsSync(userNpmrcPath)) {
            core.info('Found existing user .npmrc file');
            const userNpmrcContent = yield promises_1.default.readFile(userNpmrcPath, 'utf8');
            const authLine = userNpmrcContent.split('\n').find((line) => {
                // check based on https://github.com/npm/cli/blob/8f8f71e4dd5ee66b3b17888faad5a7bf6c657eed/test/lib/adduser.js#L103-L105
                return /^\s*\/\/registry\.npmjs\.org\/:[_-]authToken=/i.test(line);
            });
            if (authLine) {
                core.info('Found existing auth token for the npm registry in the user .npmrc file');
            }
            else {
                core.info("Didn't find existing auth token for the npm registry in the user .npmrc file, creating one");
                fs_1.default.appendFileSync(userNpmrcPath, `\n//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}\n`);
            }
        }
        else {
            core.info('No user .npmrc file found, creating one');
            fs_1.default.writeFileSync(userNpmrcPath, `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}\n`);
        }
    });
}
