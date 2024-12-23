"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateVarHandler = void 0;
const logger_1 = require("@rocket.chat/logger");
const logger = new logger_1.Logger('TemplateVarHandler');
const templateVarHandler = function (variable, object) {
    const templateRegex = /#{([\w\-]+)}/gi;
    let match = templateRegex.exec(variable);
    let tmpVariable = variable;
    if (match == null) {
        if (!object.hasOwnProperty(variable)) {
            logger === null || logger === void 0 ? void 0 : logger.debug(`user does not have attribute: ${variable}`);
            return;
        }
        return object[variable];
    }
    logger === null || logger === void 0 ? void 0 : logger.debug('template found. replacing values');
    while (match != null) {
        const tmplVar = match[0];
        const tmplAttrName = match[1];
        if (!object.hasOwnProperty(tmplAttrName)) {
            logger === null || logger === void 0 ? void 0 : logger.debug(`user does not have attribute: ${tmplAttrName}`);
            return;
        }
        const attrVal = object[tmplAttrName];
        logger === null || logger === void 0 ? void 0 : logger.debug(`replacing template var: ${tmplVar} with value: ${attrVal}`);
        tmpVariable = tmpVariable.replace(tmplVar, attrVal);
        match = templateRegex.exec(variable);
    }
    return tmpVariable;
};
exports.templateVarHandler = templateVarHandler;
