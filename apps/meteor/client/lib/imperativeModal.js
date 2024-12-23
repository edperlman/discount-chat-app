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
Object.defineProperty(exports, "__esModule", { value: true });
exports.imperativeModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const emitter_1 = require("@rocket.chat/emitter");
const react_1 = __importStar(require("react"));
const ModalStore_1 = require("../providers/ModalProvider/ModalStore");
const mapCurrentModal = (descriptor) => {
    if (descriptor === null) {
        return null;
    }
    if ('component' in descriptor) {
        return ((0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)("div", {}), children: (0, react_1.createElement)(descriptor.component, Object.assign({ key: Math.random() }, descriptor.props)) }));
    }
};
class ImperativeModalEmmiter extends emitter_1.Emitter {
    constructor(store) {
        super();
        this.open = (descriptor) => {
            return this.store.open(mapCurrentModal(descriptor));
        };
        this.push = (descriptor) => {
            return this.store.push(mapCurrentModal(descriptor));
        };
        this.close = () => {
            this.store.close();
        };
        this.store = store;
    }
}
exports.imperativeModal = new ImperativeModalEmmiter(ModalStore_1.modalStore);
