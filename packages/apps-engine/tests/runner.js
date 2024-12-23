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
const alsatian_1 = require("alsatian");
const tap_bark_1 = require("tap-bark");
(function _appEngineTestRunner() {
    return __awaiter(this, void 0, void 0, function* () {
        const testSet = alsatian_1.TestSet.create();
        testSet.addTestsFromFiles('./**/*.spec.ts');
        const testRunner = new alsatian_1.TestRunner();
        if (!process.argv.includes('--no-tap')) {
            testRunner.outputStream.pipe(tap_bark_1.TapBark.create().getPipeable()).pipe(process.stdout);
        }
        else {
            testRunner.outputStream.pipe(process.stdout);
        }
        yield testRunner.run(testSet);
    });
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
