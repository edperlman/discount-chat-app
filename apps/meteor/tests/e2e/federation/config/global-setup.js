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
exports.default = default_1;
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        const requiredEnvVars = [
            'RC_SERVER_1',
            'RC_SERVER_2',
            'RC_SERVER_1_ADMIN_USER',
            'RC_SERVER_1_ADMIN_PASSWORD',
            'RC_SERVER_1_MATRIX_SERVER_NAME',
            'RC_SERVER_2_ADMIN_USER',
            'RC_SERVER_2_ADMIN_PASSWORD',
            'RC_SERVER_2_MATRIX_SERVER_NAME',
            'RC_EXTRA_SERVER',
            'RC_EXTRA_SERVER_ADMIN_USER',
            'RC_EXTRA_SERVER_ADMIN_PASSWORD',
            'RC_EXTRA_SERVER_MATRIX_SERVER_NAME',
        ];
        if (requiredEnvVars.some((envVar) => !process.env[envVar])) {
            throw new Error(`Missing required environment variables: ${requiredEnvVars.filter((envVar) => !process.env[envVar]).join(', ')}`);
        }
    });
}
