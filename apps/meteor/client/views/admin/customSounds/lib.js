"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSoundData = void 0;
exports.validate = validate;
// Here previousData will define if it is an update or a new entry
function validate(soundData, soundFile) {
    const errors = [];
    if (!soundData.name) {
        errors.push('Name');
    }
    if (!soundData._id && !soundFile) {
        errors.push('Sound File');
    }
    if (soundFile) {
        if (!soundData.previousSound || soundData.previousSound !== soundFile) {
            if (!/audio\/mp3/.test(soundFile.type) && !/audio\/mpeg/.test(soundFile.type) && !/audio\/x-mpeg/.test(soundFile.type)) {
                errors.push('FileType');
            }
        }
    }
    return errors;
}
const createSoundData = (soundFile, name, previousData) => {
    var _a;
    if (!previousData) {
        return {
            name: name.trim(),
            extension: (soundFile === null || soundFile === void 0 ? void 0 : soundFile.name.split('.').pop()) || '',
            newFile: true,
        };
    }
    return {
        _id: previousData._id,
        name,
        extension: (soundFile === null || soundFile === void 0 ? void 0 : soundFile.name.split('.').pop()) || '',
        previousName: previousData.previousName,
        previousExtension: (_a = previousData.previousSound) === null || _a === void 0 ? void 0 : _a.extension,
        previousSound: previousData.previousSound,
        newFile: false,
    };
};
exports.createSoundData = createSoundData;
