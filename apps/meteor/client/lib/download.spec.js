"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const download_1 = require("./download");
describe('download', () => {
    it('should work', () => {
        const listener = jest.fn();
        document.addEventListener('click', listener, false);
        (0, download_1.download)('about:blank', 'blank');
        document.removeEventListener('click', listener, false);
        expect(listener).toHaveBeenCalled();
    });
});
describe('downloadAs', () => {
    it('should work', () => {
        const listener = jest.fn();
        document.addEventListener('click', listener, false);
        (0, download_1.downloadAs)({ data: [] }, 'blank');
        document.removeEventListener('click', listener, false);
        expect(listener).toHaveBeenCalled();
    });
});
describe('downloadJsonAs', () => {
    it('should work', () => {
        const listener = jest.fn();
        document.addEventListener('click', listener, false);
        (0, download_1.downloadJsonAs)({}, 'blank');
        document.removeEventListener('click', listener, false);
        expect(listener).toHaveBeenCalled();
    });
});
describe('downloadCsvAs', () => {
    it('should work', () => {
        const listener = jest.fn();
        document.addEventListener('click', listener, false);
        (0, download_1.downloadCsvAs)([
            [1, 2, 3],
            [4, 5, 6],
        ], 'blank');
        document.removeEventListener('click', listener, false);
        expect(listener).toHaveBeenCalled();
    });
});
