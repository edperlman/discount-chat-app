"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mimeTypes_1 = require("../../../app/utils/lib/mimeTypes");
describe('mimeTypes', () => {
    describe('#getExtension()', () => {
        it('should return an empty string if the given param is an invalid mime type', () => {
            (0, chai_1.expect)((0, mimeTypes_1.getExtension)('invalid-mime')).to.be.equal('');
        });
        it('should return the correct extension when the mime type is valid', () => {
            (0, chai_1.expect)((0, mimeTypes_1.getExtension)('image/png')).to.be.equal('png');
        });
    });
});
