"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCsvAs = exports.downloadJsonAs = exports.downloadAs = exports.download = void 0;
const download = (href, filename) => {
    const anchorElement = document.createElement('a');
    anchorElement.download = filename;
    anchorElement.href = href;
    anchorElement.target = '_blank';
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
};
exports.download = download;
const hasMsSaveOrOpenBlob = (navigator) => 'msSaveOrOpenBlob' in navigator;
const downloadAs = (_a, filename) => {
    var _b;
    var { data } = _a, options = __rest(_a, ["data"]);
    const blob = new Blob(data, options);
    if (hasMsSaveOrOpenBlob(navigator)) {
        navigator.msSaveOrOpenBlob(blob);
        return;
    }
    const URL = (_b = window.webkitURL) !== null && _b !== void 0 ? _b : window.URL;
    const blobUrl = URL.createObjectURL(blob);
    (0, exports.download)(blobUrl, filename);
    URL.revokeObjectURL(blobUrl);
};
exports.downloadAs = downloadAs;
const downloadJsonAs = (jsonObject, basename) => {
    (0, exports.downloadAs)({
        data: [decodeURIComponent(encodeURI(JSON.stringify(jsonObject, null, 2)))],
        type: 'application/json;charset=utf-8',
    }, `${basename}.json`);
};
exports.downloadJsonAs = downloadJsonAs;
const downloadCsvAs = (csvData, basename) => {
    const escapeCell = (cell) => `"${String(cell).replace(/"/g, '""')}"`;
    const content = csvData.reduce((content, row) => `${content + row.map(escapeCell).join(';')}\n`, '');
    (0, exports.downloadAs)({
        data: [decodeURIComponent(encodeURI(content))],
        type: 'text/csv;charset=utf-8',
        endings: 'native',
    }, `${basename}.csv`);
};
exports.downloadCsvAs = downloadCsvAs;
