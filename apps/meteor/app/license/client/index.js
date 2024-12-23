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
exports.hasLicense = hasLicense;
const fetchFeatures_1 = require("../../../client/lib/fetchFeatures");
const queryClient_1 = require("../../../client/lib/queryClient");
function hasLicense(feature) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const features = yield queryClient_1.queryClient.fetchQuery({
                queryKey: ['ee.features'],
                queryFn: fetchFeatures_1.fetchFeatures,
            });
            return features.includes(feature);
        }
        catch (e) {
            console.error('Error getting modules', e);
            return false;
        }
    });
}
