"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportingErrorStates = exports.ImportingStartedStates = exports.ImportPreparingStartedStates = exports.ImportFileReadyStates = exports.ImportWaitingStates = exports.ProgressStep = void 0;
/** The progress step that an importer is at. */
exports.ProgressStep = Object.freeze({
    NEW: 'importer_new',
    UPLOADING: 'importer_uploading',
    DOWNLOADING_FILE: 'importer_downloading_file',
    FILE_LOADED: 'importer_file_loaded',
    PREPARING_STARTED: 'importer_preparing_started',
    PREPARING_USERS: 'importer_preparing_users',
    PREPARING_CHANNELS: 'importer_preparing_channels',
    PREPARING_MESSAGES: 'importer_preparing_messages',
    PREPARING_CONTACTS: 'importer_preparing_contacts',
    USER_SELECTION: 'importer_user_selection',
    IMPORTING_STARTED: 'importer_importing_started',
    IMPORTING_USERS: 'importer_importing_users',
    IMPORTING_CHANNELS: 'importer_importing_channels',
    IMPORTING_MESSAGES: 'importer_importing_messages',
    IMPORTING_CONTACTS: 'importer_importing_contacts',
    IMPORTING_FILES: 'importer_importing_files',
    FINISHING: 'importer_finishing',
    DONE: 'importer_done',
    ERROR: 'importer_import_failed',
    CANCELLED: 'importer_import_cancelled',
});
exports.ImportWaitingStates = [exports.ProgressStep.NEW, exports.ProgressStep.UPLOADING, exports.ProgressStep.DOWNLOADING_FILE];
exports.ImportFileReadyStates = [exports.ProgressStep.FILE_LOADED];
exports.ImportPreparingStartedStates = [
    exports.ProgressStep.PREPARING_STARTED,
    exports.ProgressStep.PREPARING_USERS,
    exports.ProgressStep.PREPARING_CHANNELS,
    exports.ProgressStep.PREPARING_MESSAGES,
    exports.ProgressStep.PREPARING_CONTACTS,
];
exports.ImportingStartedStates = [
    exports.ProgressStep.IMPORTING_STARTED,
    exports.ProgressStep.IMPORTING_USERS,
    exports.ProgressStep.IMPORTING_CHANNELS,
    exports.ProgressStep.IMPORTING_MESSAGES,
    exports.ProgressStep.IMPORTING_CONTACTS,
    exports.ProgressStep.IMPORTING_FILES,
    exports.ProgressStep.FINISHING,
];
exports.ImportingErrorStates = [exports.ProgressStep.ERROR, exports.ProgressStep.CANCELLED];
