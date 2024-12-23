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
exports.syncOutlookEvents = void 0;
const NotOnDesktopError_1 = require("./NotOnDesktopError");
const syncOutlookEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    const desktopApp = window.RocketChatDesktop;
    if (!(desktopApp === null || desktopApp === void 0 ? void 0 : desktopApp.getOutlookEvents)) {
        throw new NotOnDesktopError_1.NotOnDesktopError();
    }
    const response = yield desktopApp.getOutlookEvents(date);
    if (response.status === 'canceled') {
        throw new Error('abort');
    }
});
exports.syncOutlookEvents = syncOutlookEvents;
