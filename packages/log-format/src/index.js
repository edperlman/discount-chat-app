"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = void 0;
// Copied from meteor/logging package
const chalk_1 = __importDefault(require("chalk"));
const ejson_1 = require("ejson");
const RESTRICTED_KEYS = ['time', 'timeInexact', 'level', 'file', 'line', 'program', 'originApp', 'satellite', 'stderr'];
const FORMATTED_KEYS = [...RESTRICTED_KEYS, 'app', 'message'];
const LEVEL_COLORS = {
    debug: 'green',
    // leave info as the default color
    warn: 'magenta',
    error: 'red',
    info: 'blue',
};
const META_COLOR = 'blue';
chalk_1.default.level = 2;
// Default colors cause readability problems on Windows Powershell,
// switch to bright variants. While still capable of millions of
// operations per second, the benchmark showed a 25%+ increase in
// ops per second (on Node 8) by caching "process.platform".
const isWin32 = typeof process === 'object' && process.platform === 'win32';
const platformColor = (color) => {
    if (isWin32 && typeof color === 'string' && !color.endsWith('Bright')) {
        return `${color}Bright`;
    }
    return color;
};
const prettify = function (line = '', color) {
    if (!color)
        return line;
    // @ts-expect-error - greyBright doesnt exists, its just gray :(
    return chalk_1.default[color](line);
};
const format = (obj, options = {}) => {
    obj = Object.assign({}, obj); // don't mutate the argument
    const { time, timeInexact, level = 'info', file, line: lineNumber, app: appName = '', originApp, program = '', satellite = '', stderr = '', } = obj;
    let { message } = obj;
    if (!(time instanceof Date)) {
        throw new Error("'time' must be a Date object");
    }
    FORMATTED_KEYS.forEach((key) => {
        // @ts-expect-error - we know this is good
        delete obj[key];
    });
    if (Object.keys(obj).length > 0) {
        if (message) {
            message += ' ';
        }
        message += (0, ejson_1.stringify)(obj);
    }
    const pad2 = (n) => n.toString().padStart(2, '0');
    const pad3 = (n) => n.toString().padStart(3, '0');
    const dateStamp = time.getFullYear().toString() + pad2(time.getMonth() + 1 /* 0-based*/) + pad2(time.getDate());
    const timeStamp = `${pad2(time.getHours())}:${pad2(time.getMinutes())}:${pad2(time.getSeconds())}.${pad3(time.getMilliseconds())}`;
    // eg in San Francisco in June this will be '(-7)'
    const utcOffsetStr = `(${-(new Date().getTimezoneOffset() / 60)})`;
    let appInfo = '';
    if (appName) {
        appInfo += appName;
    }
    if (originApp && originApp !== appName) {
        appInfo += ` via ${originApp}`;
    }
    if (appInfo) {
        appInfo = `[${appInfo}] `;
    }
    const sourceInfoParts = [];
    if (program) {
        sourceInfoParts.push(program);
    }
    if (file) {
        sourceInfoParts.push(file);
    }
    if (lineNumber) {
        sourceInfoParts.push(lineNumber);
    }
    let sourceInfo = !sourceInfoParts.length ? '' : `(${sourceInfoParts.join(':')}) `;
    if (satellite)
        sourceInfo += `[${satellite}]`;
    const stderrIndicator = stderr ? '(STDERR) ' : '';
    const metaPrefix = [
        level.charAt(0).toUpperCase(),
        dateStamp,
        '-',
        timeStamp,
        utcOffsetStr,
        timeInexact ? '? ' : ' ',
        appInfo,
        sourceInfo,
        stderrIndicator,
    ].join('');
    return (prettify(metaPrefix, options.color ? platformColor(options.metaColor || META_COLOR) : undefined) +
        prettify(message, options.color ? platformColor(LEVEL_COLORS[level]) : undefined));
};
exports.format = format;
