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
Object.defineProperty(exports, "__esModule", { value: true });
const license_1 = require("@rocket.chat/license");
const meteor_1 = require("meteor/meteor");
require("./methods/addMonitor");
require("./methods/getUnitsFromUserRoles");
require("./methods/removeMonitor");
require("./methods/removeTag");
require("./methods/saveTag");
require("./methods/removeUnit");
require("./methods/saveUnit");
require("./methods/removeBusinessHour");
require("./methods/resumeOnHold");
require("./hooks/afterTakeInquiry");
require("./hooks/beforeNewInquiry");
require("./hooks/beforeNewRoom");
require("./hooks/beforeRoutingChat");
require("./hooks/checkAgentBeforeTakeInquiry");
require("./hooks/handleNextAgentPreferredEvents");
require("./hooks/onCheckRoomParamsApi");
require("./hooks/onLoadConfigApi");
require("./hooks/onSaveVisitorInfo");
require("./hooks/scheduleAutoTransfer");
require("./hooks/resumeOnHold");
require("./hooks/afterOnHold");
require("./hooks/onTransferFailure");
require("./lib/routing/LoadBalancing");
require("./lib/routing/LoadRotation");
require("./lib/AutoCloseOnHoldScheduler");
require("./business-hour");
const priorities_1 = require("./priorities");
await license_1.License.onLicense('livechat-enterprise', () => __awaiter(void 0, void 0, void 0, function* () {
    require('./api');
    require('./hooks');
    yield Promise.resolve().then(() => __importStar(require('./startup')));
    const { createPermissions } = yield Promise.resolve().then(() => __importStar(require('./permissions')));
    const { createSettings } = yield Promise.resolve().then(() => __importStar(require('./settings')));
    meteor_1.Meteor.startup(() => {
        void createSettings();
        void createPermissions();
        void (0, priorities_1.createDefaultPriorities)();
    });
}));
