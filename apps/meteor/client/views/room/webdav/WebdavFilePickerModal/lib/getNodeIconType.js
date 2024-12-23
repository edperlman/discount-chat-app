"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeIconType = void 0;
const getNodeIconType = (basename, fileType, mime) => {
    let icon = 'clip';
    let type = '';
    let extension = basename === null || basename === void 0 ? void 0 : basename.split('.').pop();
    if (extension === basename) {
        extension = '';
    }
    if (!mime) {
        throw new Error('mime is required');
    }
    if (fileType === 'directory') {
        icon = 'folder';
        type = 'directory';
    }
    else if (mime.match(/application\/pdf/)) {
        icon = 'file-pdf';
        type = 'pdf';
    }
    else if (['application/vnd.oasis.opendocument.text', 'application/vnd.oasis.opendocument.presentation'].includes(mime)) {
        icon = 'file-document';
        type = 'document';
    }
    else if ([
        'application/vnd.ms-excel',
        'application/vnd.oasis.opendocument.spreadsheet',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ].includes(mime)) {
        icon = 'file-sheets';
        type = 'sheets';
    }
    else if (['application/vnd.ms-powerpoint', 'application/vnd.oasis.opendocument.presentation'].includes(mime)) {
        icon = 'file-sheets';
        type = 'ppt';
    }
    return { icon, type, extension };
};
exports.getNodeIconType = getNodeIconType;
