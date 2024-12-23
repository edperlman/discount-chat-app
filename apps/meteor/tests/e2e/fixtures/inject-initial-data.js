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
exports.default = injectInitialData;
const mongodb_1 = require("mongodb");
const constants = __importStar(require("../config/constants"));
const users_1 = require("./collections/users");
const userStates_1 = require("./userStates");
function injectInitialData() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield mongodb_1.MongoClient.connect(constants.URL_MONGODB);
        const usersFixtures = [
            (0, users_1.createUserFixture)(userStates_1.Users.user1),
            (0, users_1.createUserFixture)(userStates_1.Users.user2),
            (0, users_1.createUserFixture)(userStates_1.Users.user3),
            (0, users_1.createUserFixture)(userStates_1.Users.userE2EE),
        ];
        yield Promise.all(usersFixtures.map((user) => connection.db().collection('users').updateOne({ username: user.username }, { $set: user }, { upsert: true })));
        yield connection
            .db()
            .collection('users')
            .updateOne({ username: userStates_1.Users.admin.data.username }, { $addToSet: { 'services.resume.loginTokens': { when: userStates_1.Users.admin.data.loginExpire, hashedToken: userStates_1.Users.admin.data.hashedToken } } });
        yield Promise.all([
            {
                _id: 'API_Enable_Rate_Limiter_Dev',
                value: false,
            },
            {
                _id: 'Show_Setup_Wizard',
                value: 'completed',
            },
            {
                _id: 'Country',
                value: 'brazil',
            },
            {
                _id: 'Organization_Type',
                value: 'community',
            },
            {
                _id: 'Industry',
                value: 'aerospaceDefense',
            },
            {
                _id: 'Size',
                value: 0,
            },
            {
                _id: 'Organization_Name',
                value: 'any_name',
            },
            {
                _id: 'API_Enable_Rate_Limiter_Dev',
                value: false,
            },
            {
                _id: 'Accounts_OAuth_Google',
                value: false,
            },
            {
                _id: 'Livechat_Require_Contact_Verification',
                value: 'never',
            },
        ].map((setting) => connection
            .db()
            .collection('rocketchat_settings')
            .updateOne({ _id: setting._id }, { $set: { value: setting.value } })));
        return { usersFixtures };
    });
}
