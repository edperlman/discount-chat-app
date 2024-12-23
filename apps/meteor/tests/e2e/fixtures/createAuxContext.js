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
exports.createAuxContext = void 0;
const createAuxContext = (browser_1, userState_1, ...args_1) => __awaiter(void 0, [browser_1, userState_1, ...args_1], void 0, function* (browser, userState, route = '/', waitForMainContent = true) {
    const page = yield browser.newPage({ storageState: userState.state });
    yield page.goto(route);
    if (waitForMainContent) {
        yield page.locator('.main-content').waitFor();
    }
    return { page };
});
exports.createAuxContext = createAuxContext;
