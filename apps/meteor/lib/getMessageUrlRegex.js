"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageUrlRegex = void 0;
const getMessageUrlRegex = () => /([A-Za-z]{3,9}):\/\/([-;:&=\+\$,\w]+@{1})?([-A-Za-z0-9\.]+)+:?(\d+)?((\/[-\+=!:~%\/\.@\,\w]*)?\??([-\+=&!:;%@\/\.\,\w]+)?(?:#([^\s\)]+))?)?/g;
exports.getMessageUrlRegex = getMessageUrlRegex;
