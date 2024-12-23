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
exports.updateApp = void 0;
const handleAPIError_1 = require("./handleAPIError");
const warnStatusChange_1 = require("./warnStatusChange");
const orchestrator_1 = require("../../../apps/orchestrator");
const updateApp = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, name, marketplaceVersion, permissionsGranted }) {
    try {
        const { status } = yield orchestrator_1.AppClientOrchestratorInstance.updateApp(id, marketplaceVersion, permissionsGranted);
        if (status) {
            (0, warnStatusChange_1.warnStatusChange)(name, status);
        }
    }
    catch (error) {
        (0, handleAPIError_1.handleAPIError)(error);
    }
});
exports.updateApp = updateApp;
