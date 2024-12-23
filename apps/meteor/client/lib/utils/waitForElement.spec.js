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
const waitForElement_1 = require("./waitForElement");
beforeEach(() => {
    document.body.innerHTML = `<span class="ready" />`;
});
it('should return the element when it is already in the dom', () => __awaiter(void 0, void 0, void 0, function* () {
    expect(yield (0, waitForElement_1.waitForElement)('.ready')).toBe(document.querySelector('.ready'));
}));
it('should await until the element be in the dom and return it', () => __awaiter(void 0, void 0, void 0, function* () {
    setTimeout(() => {
        const element = document.createElement('div');
        element.setAttribute('class', 'not-ready');
        document.body.appendChild(element);
    }, 5);
    expect(yield (0, waitForElement_1.waitForElement)('.not-ready')).toBe(document.querySelector('.not-ready'));
}));
