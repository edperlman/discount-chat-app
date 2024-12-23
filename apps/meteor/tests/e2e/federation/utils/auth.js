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
exports.doLogin = void 0;
const doLogin = (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, server, storageNamePrefix, storeState, }) {
    yield page.goto(`${server.url}/login`);
    yield page.locator('role=textbox[name=/username/i]').type(server.username);
    yield page.locator('[name=password]').type(server.password);
    yield page.locator('role=button[name="Login"]').click();
    yield page.waitForTimeout(1000);
    if (storeState) {
        yield page.context().storageState({ path: `${storageNamePrefix}-session.json` });
    }
});
exports.doLogin = doLogin;
