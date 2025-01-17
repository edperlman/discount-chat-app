"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortWebdavNodes = void 0;
const sortWebdavNodes = (data, sortBy, sortDirection) => {
    if (sortDirection === 'desc') {
        if (sortBy === 'name') {
            data.sort((a, b) => b.basename.localeCompare(a.basename));
        }
        if (sortBy === 'size') {
            data.sort((a, b) => b.size - a.size);
        }
        if (sortBy === 'date') {
            data.sort((a, b) => new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime());
        }
    }
    else {
        if (sortBy === 'name') {
            data.sort((a, b) => a.basename.localeCompare(b.basename));
        }
        if (sortBy === 'size') {
            data.sort((a, b) => a.size - b.size);
        }
        if (sortBy === 'date') {
            data.sort((a, b) => new Date(a.lastmod).getTime() - new Date(b.lastmod).getTime());
        }
    }
    return data;
};
exports.sortWebdavNodes = sortWebdavNodes;
