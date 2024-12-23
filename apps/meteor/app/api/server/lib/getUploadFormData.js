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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadFormData = getUploadFormData;
const core_services_1 = require("@rocket.chat/core-services");
const busboy_1 = __importDefault(require("busboy"));
const mimeTypes_1 = require("../../../utils/lib/mimeTypes");
function getUploadFormData(_a) {
    return __awaiter(this, arguments, void 0, function* ({ request }, options = {}) {
        const limits = Object.assign({ files: 1 }, (options.sizeLimit && options.sizeLimit > -1 && { fileSize: options.sizeLimit }));
        const bb = (0, busboy_1.default)({ headers: request.headers, defParamCharset: 'utf8', limits });
        const fields = Object.create(null);
        let uploadedFile;
        let returnResult = (_value) => {
            // noop
        };
        let returnError = (_error) => {
            // noop
        };
        function onField(fieldname, value) {
            fields[fieldname] = value;
            uploadedFile = {
                fields,
                encoding: undefined,
                filename: undefined,
                fieldname: undefined,
                mimetype: undefined,
                fileBuffer: undefined,
                file: undefined,
            };
        }
        function onEnd() {
            var _a;
            if (!uploadedFile) {
                return returnError(new core_services_1.MeteorError('No file or fields were uploaded'));
            }
            if (!('file' in uploadedFile) && !options.fileOptional) {
                return returnError(new core_services_1.MeteorError('No file uploaded'));
            }
            if (options.validate !== undefined && !options.validate(fields)) {
                return returnError(new core_services_1.MeteorError(`Invalid fields ${(_a = options.validate.errors) === null || _a === void 0 ? void 0 : _a.join(', ')}`));
            }
            return returnResult(uploadedFile);
        }
        function onFile(fieldname, file, { filename, encoding, mimeType: mimetype }) {
            if (options.field && fieldname !== options.field) {
                file.resume();
                return returnError(new core_services_1.MeteorError('invalid-field'));
            }
            const fileChunks = [];
            file.on('data', (chunk) => {
                fileChunks.push(chunk);
            });
            file.on('end', () => {
                if (file.truncated) {
                    fileChunks.length = 0;
                    return returnError(new core_services_1.MeteorError('error-file-too-large'));
                }
                uploadedFile = {
                    file,
                    filename,
                    encoding,
                    mimetype: (0, mimeTypes_1.getMimeType)(mimetype, filename),
                    fieldname,
                    fields,
                    fileBuffer: Buffer.concat(fileChunks),
                };
            });
        }
        function cleanup() {
            request.unpipe(bb);
            request.on('readable', request.read.bind(request));
            bb.removeAllListeners();
        }
        bb.on('field', onField);
        bb.on('file', onFile);
        bb.on('close', cleanup);
        bb.on('end', onEnd);
        bb.on('finish', onEnd);
        bb.on('error', (err) => {
            returnError(err);
        });
        bb.on('partsLimit', () => {
            returnError();
        });
        bb.on('filesLimit', () => {
            returnError('Just 1 file is allowed');
        });
        bb.on('fieldsLimit', () => {
            returnError();
        });
        request.pipe(bb);
        return new Promise((resolve, reject) => {
            returnResult = resolve;
            returnError = reject;
        });
    });
}
