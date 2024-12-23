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
const highOrderFunctions_1 = require("../../lib/utils/highOrderFunctions");
const findDeclarations = (code) => {
    var _a;
    return ((_a = code.match(/(--[^:; ]+:..*?;)/g)) !== null && _a !== void 0 ? _a : []).map((declaration) => {
        const matches = /(.*?):\s*(.*?)\s*;/.exec(declaration);
        if (matches === null) {
            throw new Error();
        }
        const [, name, value] = matches;
        return [
            name,
            value.indexOf('var(') >= 0
                ? (variables) => value.replace(/var\((--.*?)\)/gm, (_, name) => { var _a; return (_a = variables[name]) === null || _a === void 0 ? void 0 : _a.call(null, variables); })
                : () => value,
        ];
    });
};
const replaceReferences = (code, variables) => code.replace(/var\((--.*?)\)/gm, (_, name) => { var _a; return (_a = variables[name]) === null || _a === void 0 ? void 0 : _a.call(null, variables); });
let cssVariablesElement;
const originalCodes = new Map();
const update = (0, highOrderFunctions_1.withDebouncing)({ wait: 100 })(() => {
    const declarations = [].concat(...Array.from(originalCodes.values(), findDeclarations), findDeclarations(cssVariablesElement.innerHTML));
    const variables = Object.fromEntries(declarations);
    originalCodes.forEach((originalCode, element) => {
        const patchedCode = replaceReferences(originalCode, variables);
        let patchedElement = element.nextElementSibling;
        if (!patchedElement || !patchedElement.classList.contains('patched-css-variables')) {
            patchedElement = document.createElement('style');
            patchedElement.type = 'text/css';
            patchedElement.classList.add('patched-css-variables');
            element.insertAdjacentElement('afterend', patchedElement);
        }
        const { sheet } = patchedElement;
        while (sheet.cssRules.length > 0) {
            sheet.deleteRule(0);
        }
        sheet.insertRule(`@media all {${patchedCode}}`, 0);
    });
});
const findAndPatchFromLinkElements = () => {
    Array.from(document.querySelectorAll('link[type="text/css"].__meteor-css__')).forEach((linkElement) => __awaiter(void 0, void 0, void 0, function* () {
        const url = linkElement.getAttribute('href');
        if (url === null) {
            return;
        }
        try {
            const response = yield fetch(url);
            const code = yield response.text();
            originalCodes.set(linkElement, code);
        }
        catch (error) {
            console.warn(error);
        }
        finally {
            update();
        }
    }));
};
const waitAndInitialize = () => {
    if (document.readyState !== 'complete') {
        requestAnimationFrame(waitAndInitialize);
        return;
    }
    const element = document.getElementById('css-variables');
    if (element === null) {
        requestAnimationFrame(waitAndInitialize);
        return;
    }
    cssVariablesElement = element;
    const cssVariablesElementObserver = new MutationObserver(() => {
        update();
    });
    cssVariablesElementObserver.observe(cssVariablesElement, { childList: true });
    findAndPatchFromLinkElements();
};
(() => {
    var _a, _b;
    if ((_b = (_a = window.CSS) === null || _a === void 0 ? void 0 : _a.supports) === null || _b === void 0 ? void 0 : _b.call(_a, '(--foo: red)')) {
        return;
    }
    waitAndInitialize();
})();
