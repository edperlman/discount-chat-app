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
exports.BeforeSaveBadWords = void 0;
class BeforeSaveBadWords {
    constructor() {
        this.badWords = null;
    }
    configure(badWordsList, goodWordsList) {
        return __awaiter(this, void 0, void 0, function* () {
            const { default: Filter } = yield Promise.resolve().then(() => __importStar(require('bad-words')));
            const options = {
                list: (badWordsList === null || badWordsList === void 0 ? void 0 : badWordsList.split(',').map((word) => word.trim()).filter(Boolean)) || [],
                // library definition does not allow optional definition
                exclude: undefined,
                splitRegex: undefined,
                placeHolder: undefined,
                regex: undefined,
                replaceRegex: undefined,
                emptyList: undefined,
            };
            this.badWords = new Filter(options);
            if (goodWordsList === null || goodWordsList === void 0 ? void 0 : goodWordsList.length) {
                this.badWords.removeWords(...goodWordsList.split(',').map((word) => word.trim()));
            }
        });
    }
    disable() {
        this.badWords = null;
    }
    filterBadWords(_a) {
        return __awaiter(this, arguments, void 0, function* ({ message }) {
            if (!message.msg || !this.badWords) {
                return message;
            }
            try {
                message.msg = this.badWords.clean(message.msg);
            }
            catch (error) {
                // ignore
            }
            return message;
        });
    }
}
exports.BeforeSaveBadWords = BeforeSaveBadWords;