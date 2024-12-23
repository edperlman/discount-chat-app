"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filter = void 0;
const meteor_1 = require("meteor/meteor");
class Filter {
    constructor(options) {
        this.options = Object.assign({ contentTypes: [], extensions: [], minSize: 1, maxSize: 0, invalidFileError: () => new meteor_1.Meteor.Error('invalid-file', 'File is not valid'), fileTooSmallError: (fileSize, minFileSize) => new meteor_1.Meteor.Error('file-too-small', `File size (size = ${fileSize}) is too small (min = ${minFileSize})`), fileTooLargeError: (fileSize, maxFileSize) => new meteor_1.Meteor.Error('file-too-large', `File size (size = ${fileSize}) is too large (max = ${maxFileSize})`), invalidFileExtension: (fileExtension, allowedExtensions) => new meteor_1.Meteor.Error('invalid-file-extension', `File extension "${fileExtension}" is not accepted (${allowedExtensions})`), invalidFileType: (fileType, allowedContentTypes) => new meteor_1.Meteor.Error('invalid-file-type', `File type "${fileType}" is not accepted (${allowedContentTypes})`), onCheck: this.onCheck }, options);
        // Check options
        if (this.options.contentTypes && !(this.options.contentTypes instanceof Array)) {
            throw new TypeError('Filter: contentTypes is not an Array');
        }
        if (this.options.extensions && !(this.options.extensions instanceof Array)) {
            throw new TypeError('Filter: extensions is not an Array');
        }
        if (typeof this.options.minSize !== 'number') {
            throw new TypeError('Filter: minSize is not a number');
        }
        if (typeof this.options.maxSize !== 'number') {
            throw new TypeError('Filter: maxSize is not a number');
        }
        if (this.options.onCheck && typeof this.options.onCheck !== 'function') {
            throw new TypeError('Filter: onCheck is not a function');
        }
        if (typeof this.options.onCheck === 'function') {
            this.onCheck = this.options.onCheck;
        }
    }
    check(file, content) {
        return __awaiter(this, void 0, void 0, function* () {
            let error = null;
            if (typeof file !== 'object' || !file) {
                error = this.options.invalidFileError();
            }
            // Check size
            const fileSize = file.size || 0;
            const minSize = this.getMinSize();
            if (fileSize <= 0 || fileSize < minSize) {
                error = this.options.fileTooSmallError(fileSize, minSize);
            }
            const maxSize = this.getMaxSize();
            if (maxSize > 0 && fileSize > maxSize) {
                error = this.options.fileTooLargeError(fileSize, maxSize);
            }
            // Check extension
            const allowedExtensions = this.getExtensions();
            const fileExtension = file.extension || '';
            if (allowedExtensions.length && !allowedExtensions.includes(fileExtension)) {
                error = this.options.invalidFileExtension(fileExtension, allowedExtensions);
            }
            // Check content type
            const allowedContentTypes = this.getContentTypes();
            const fileTypes = file.type;
            if (allowedContentTypes.length && !this.isContentTypeInList(fileTypes, allowedContentTypes)) {
                error = this.options.invalidFileType(fileTypes, allowedContentTypes);
            }
            // Apply custom check
            if (typeof this.onCheck === 'function' && !(yield this.onCheck(file, content))) {
                error = new meteor_1.Meteor.Error('invalid-file', 'File does not match filter');
            }
            if (error) {
                throw error;
            }
        });
    }
    getContentTypes() {
        return this.options.contentTypes;
    }
    getExtensions() {
        return this.options.extensions;
    }
    getMaxSize() {
        return this.options.maxSize;
    }
    getMinSize() {
        return this.options.minSize;
    }
    isContentTypeInList(type, list) {
        if (typeof type === 'string' && list instanceof Array) {
            if (list.includes(type)) {
                return true;
            }
            const wildCardGlob = '/*';
            const wildcards = list.filter((item) => item.indexOf(wildCardGlob) > 0);
            if (wildcards.includes(type.replace(/(\/.*)$/, wildCardGlob))) {
                return true;
            }
        }
        return false;
    }
    isValid(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = true;
            try {
                yield this.check(file);
            }
            catch (err) {
                result = false;
            }
            return result;
        });
    }
    onCheck(_file, _content) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
}
exports.Filter = Filter;
