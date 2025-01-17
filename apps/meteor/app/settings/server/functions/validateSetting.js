"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSetting = void 0;
const validateSetting = (_id, type, value) => {
    switch (type) {
        case 'asset':
            if (typeof value !== 'object') {
                throw new Error(`Setting ${_id} is of type ${type} but got ${typeof value}`);
            }
            break;
        case 'string':
        case 'relativeUrl':
        case 'password':
        case 'language':
        case 'color':
        case 'font':
        case 'code':
        case 'action':
        case 'roomPick':
        case 'group':
            if (typeof value !== 'string') {
                throw new Error(`Setting ${_id} is of type ${type} but got ${typeof value}`);
            }
            break;
        case 'boolean':
            if (typeof value !== 'boolean') {
                throw new Error(`Setting ${_id} is of type boolean but got ${typeof value}`);
            }
            break;
        case 'int':
            if (typeof value !== 'number') {
                throw new Error(`Setting ${_id} is of type int but got ${typeof value}`);
            }
            break;
        case 'multiSelect':
            if (!Array.isArray(value)) {
                throw new Error(`Setting ${_id} is of type array but got ${typeof value}`);
            }
            break;
        case 'select':
        case 'lookup':
            if (typeof value !== 'string' && typeof value !== 'number') {
                throw new Error(`Setting ${_id} is of type ${type} but got ${typeof value}`);
            }
            break;
        case 'date':
            if (!(value instanceof Date)) {
                throw new Error(`Setting ${_id} is of type date but got ${typeof value}`);
            }
            break;
        default:
            return true;
    }
    return true;
};
exports.validateSetting = validateSetting;
