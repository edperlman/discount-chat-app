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
exports.getPaginationItems = getPaginationItems;
// If the count query param is higher than the "API_Upper_Count_Limit" setting, then we limit that
// If the count query param isn't defined, then we set it to the "API_Default_Count" setting
// If the count is zero, then that means unlimited and is only allowed if the setting "API_Allow_Infinite_Count" is true
const server_1 = require("../../../settings/server");
function getPaginationItems(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const hardUpperLimitTest = server_1.settings.get('API_Upper_Count_Limit');
        const defaultCountTest = server_1.settings.get('API_Default_Count');
        const hardUpperLimit = hardUpperLimitTest && hardUpperLimitTest <= 0 ? 100 : server_1.settings.get('API_Upper_Count_Limit');
        const defaultCount = defaultCountTest && defaultCountTest <= 0 ? 50 : server_1.settings.get('API_Default_Count');
        const offset = params.offset ? parseInt(String(params.offset || 0)) : 0;
        let count = defaultCount;
        // Ensure count is an appropriate amount
        if (params.count !== undefined && params.count !== null) {
            count = parseInt(String(params.count || 0));
        }
        else {
            count = defaultCount;
        }
        if (count > hardUpperLimit) {
            count = hardUpperLimit;
        }
        if (count === 0 && !server_1.settings.get('API_Allow_Infinite_Count')) {
            count = defaultCount;
        }
        return {
            offset,
            count,
        };
    });
}
