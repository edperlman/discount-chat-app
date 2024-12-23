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
exports.fixBrokenSynchronousAPICalls = fixBrokenSynchronousAPICalls;
const astring_1 = require("astring");
// @deno-types="../../acorn.d.ts"
const acorn_1 = require("acorn");
// @deno-types="../../acorn-walk.d.ts"
const acorn_walk_1 = require("acorn-walk");
const operations = __importStar(require("./operations.ts"));
function fixAst(ast) {
    const pendingOperations = [
        operations.fixLivechatIsOnlineCalls,
        operations.checkReassignmentOfModifiedIdentifiers,
        operations.fixRoomUsernamesCalls,
    ];
    // Have we touched the tree?
    let isModified = false;
    while (pendingOperations.length) {
        const ops = pendingOperations.splice(0);
        const state = {
            isModified: false,
            functionIdentifiers: new Set(),
        };
        (0, acorn_walk_1.fullAncestor)(ast, (node, state, ancestors, type) => {
            ops.forEach(operation => operation(node, state, ancestors, type));
        }, undefined, state);
        if (state.isModified) {
            isModified = true;
        }
        if (state.functionIdentifiers.size) {
            pendingOperations.push(operations.buildFixModifiedFunctionsOperation(state.functionIdentifiers), operations.checkReassignmentOfModifiedIdentifiers);
        }
    }
    return isModified;
}
function fixBrokenSynchronousAPICalls(appSource) {
    const astRootNode = (0, acorn_1.parse)(appSource, {
        ecmaVersion: 2017,
        // Allow everything, we don't want to complain if code is badly written
        // Also, since the code itself has been transpiled, the chance of getting
        // shenanigans is lower
        allowReserved: true,
        allowReturnOutsideFunction: true,
        allowImportExportEverywhere: true,
        allowAwaitOutsideFunction: true,
        allowSuperOutsideMethod: true,
    });
    if (fixAst(astRootNode)) {
        return (0, astring_1.generate)(astRootNode);
    }
    return appSource;
}
