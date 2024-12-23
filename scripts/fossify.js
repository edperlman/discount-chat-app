"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const promises_1 = __importDefault(require("fs/promises"));
const removeOptions = { maxRetries: 3, recursive: true };
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const fossify = async () => {
    console.log('Removing Premium Apps and Packages...');
    await promises_1.default.rmdir('./ee', removeOptions);
    console.log('Removing Premium code in the main app...');
    await promises_1.default.rmdir('./apps/meteor/ee', removeOptions);
    console.log('Replacing main files...');
    await promises_1.default.unlink('./apps/meteor/server/ee.ts');
    await promises_1.default.rename('./apps/meteor/server/foss.ts', './apps/meteor/server/ee.ts');
    console.log('Done.');
};
rl.question('Running this script will permanently delete files from the local directory. Proceed? (n,y) ', (answer) => {
    rl.close();
    if (answer.toLowerCase() !== 'y') {
        return;
    }
    fossify().catch((e) => {
        if (!e) {
            console.error('Unknown error');
            return;
        }
        console.error(e);
    });
});
