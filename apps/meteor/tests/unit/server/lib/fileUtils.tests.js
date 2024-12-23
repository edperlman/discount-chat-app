"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fileUtils_1 = require("../../../../server/lib/fileUtils");
describe('File utils', () => {
    it('should return a valid file name', () => {
        (0, chai_1.expect)((0, fileUtils_1.fileName)('something')).to.equal('something');
        (0, chai_1.expect)((0, fileUtils_1.fileName)('some@thing')).to.equal('some@thing');
        (0, chai_1.expect)((0, fileUtils_1.fileName)('/something')).to.equal('something');
        (0, chai_1.expect)((0, fileUtils_1.fileName)('/some/thing')).to.equal('some-thing');
        (0, chai_1.expect)((0, fileUtils_1.fileName)('/some/thing/')).to.equal('some-thing');
        (0, chai_1.expect)((0, fileUtils_1.fileName)('///some///thing///')).to.equal('some-thing');
        (0, chai_1.expect)((0, fileUtils_1.fileName)('some/thing')).to.equal('some-thing');
        (0, chai_1.expect)((0, fileUtils_1.fileName)('some:"thing"')).to.equal('some-thing');
        (0, chai_1.expect)((0, fileUtils_1.fileName)('some:"thing".txt')).to.equal('some-thing-.txt');
        (0, chai_1.expect)((0, fileUtils_1.fileName)('some"thing"')).to.equal('some-thing');
        (0, chai_1.expect)((0, fileUtils_1.fileName)('some\u0000thing')).to.equal('some-thing');
    });
    it('should return a valid joined path', () => {
        (0, chai_1.expect)((0, fileUtils_1.joinPath)('/app', 'some@thing')).to.equal('/app/some@thing');
        (0, chai_1.expect)((0, fileUtils_1.joinPath)('../app', 'something')).to.equal('../app/something');
        (0, chai_1.expect)((0, fileUtils_1.joinPath)('../app/', 'something')).to.equal('../app/something');
        (0, chai_1.expect)((0, fileUtils_1.joinPath)('../app/', '/something')).to.equal('../app/something');
        (0, chai_1.expect)((0, fileUtils_1.joinPath)('/app', '/something')).to.equal('/app/something');
        (0, chai_1.expect)((0, fileUtils_1.joinPath)('/app', '/../some/thing')).to.equal('/app/..-some-thing');
    });
});
