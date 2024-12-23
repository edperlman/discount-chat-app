"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRangeHeaders = void 0;
exports.getFileRange = getFileRange;
function getByteRange(header) {
    if (!header) {
        return;
    }
    const matches = header.match(/(\d+)-(\d+)/);
    if (!matches) {
        return;
    }
    return {
        start: parseInt(matches[1], 10),
        stop: parseInt(matches[2], 10),
    };
}
function getFileRange(file, req) {
    const range = getByteRange(req.headers.range);
    if (!range) {
        return;
    }
    const size = file.size || 0;
    if (range.start > size || range.stop <= range.start || range.stop > size) {
        return { outOfRange: true, start: range.start, stop: range.stop };
    }
    return { outOfRange: false, start: range.start, stop: range.stop };
}
// code from: https://github.com/jalik/jalik-ufs/blob/master/ufs-server.js#L310
const setRangeHeaders = function (range, file, res) {
    if (!range) {
        return;
    }
    if (range.outOfRange) {
        // out of range request, return 416
        res.removeHeader('Content-Length');
        res.removeHeader('Content-Type');
        res.removeHeader('Content-Disposition');
        res.removeHeader('Last-Modified');
        res.setHeader('Content-Range', `bytes */${file.size}`);
        res.writeHead(416);
        res.end();
        return;
    }
    res.setHeader('Content-Range', `bytes ${range.start}-${range.stop}/${file.size}`);
    res.removeHeader('Content-Length');
    res.setHeader('Content-Length', range.stop - range.start + 1);
    res.statusCode = 206;
};
exports.setRangeHeaders = setRangeHeaders;
