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
exports.createComposerAPI = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const accounts_base_1 = require("meteor/accounts-base");
const messageBoxFormatting_1 = require("./messageBoxFormatting");
const highOrderFunctions_1 = require("../../../../lib/utils/highOrderFunctions");
const createComposerAPI = (input, storageID) => {
    var _a;
    const triggerEvent = (input, evt) => {
        const event = new Event(evt, { bubbles: true });
        // TODO: Remove this hack for react to trigger onChange
        const tracker = input._valueTracker;
        if (tracker) {
            tracker.setValue(new Date().toString());
        }
        input.dispatchEvent(event);
    };
    const emitter = new emitter_1.Emitter();
    let _quotedMessages = [];
    const persist = (0, highOrderFunctions_1.withDebouncing)({ wait: 300 })(() => {
        if (input.value) {
            accounts_base_1.Accounts.storageLocation.setItem(storageID, input.value);
            return;
        }
        accounts_base_1.Accounts.storageLocation.removeItem(storageID);
    });
    const notifyQuotedMessagesUpdate = () => {
        emitter.emit('quotedMessagesUpdate');
    };
    input.addEventListener('input', persist);
    const setText = (text, { selection, skipFocus, } = {}) => {
        var _a, _b, _c;
        !skipFocus && focus();
        const { selectionStart, selectionEnd } = input;
        const textAreaTxt = input.value;
        if (typeof selection === 'function') {
            selection = selection({ start: selectionStart, end: selectionEnd });
        }
        if (selection) {
            if (!((_a = document.execCommand) === null || _a === void 0 ? void 0 : _a.call(document, 'insertText', false, text))) {
                input.value = textAreaTxt.substring(0, selectionStart) + text + textAreaTxt.substring(selectionStart);
                !skipFocus && focus();
            }
            input.setSelectionRange((_b = selection.start) !== null && _b !== void 0 ? _b : 0, (_c = selection.end) !== null && _c !== void 0 ? _c : text.length);
        }
        if (!selection) {
            input.value = text;
        }
        triggerEvent(input, 'input');
        triggerEvent(input, 'change');
        !skipFocus && focus();
    };
    const insertText = (text) => {
        setText(text, {
            selection: ({ start, end }) => ({
                start: start + text.length,
                end: end + text.length,
            }),
        });
    };
    const clear = () => {
        setText('');
    };
    const focus = () => {
        input.focus();
    };
    const replyWith = (text) => __awaiter(void 0, void 0, void 0, function* () {
        if (input) {
            input.value = text;
            input.focus();
        }
    });
    const quoteMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        _quotedMessages = [..._quotedMessages.filter((_message) => _message._id !== message._id), message];
        notifyQuotedMessagesUpdate();
        input.focus();
    });
    const dismissQuotedMessage = (mid) => __awaiter(void 0, void 0, void 0, function* () {
        _quotedMessages = _quotedMessages.filter((message) => message._id !== mid);
        notifyQuotedMessagesUpdate();
    });
    const dismissAllQuotedMessages = () => __awaiter(void 0, void 0, void 0, function* () {
        _quotedMessages = [];
        notifyQuotedMessagesUpdate();
    });
    const quotedMessages = {
        get: () => _quotedMessages,
        subscribe: (callback) => emitter.on('quotedMessagesUpdate', callback),
    };
    const [editing, setEditing] = (() => {
        let editing = false;
        return [
            {
                get: () => editing,
                subscribe: (callback) => emitter.on('editing', callback),
            },
            (value) => {
                editing = value;
                emitter.emit('editing');
            },
        ];
    })();
    const [recording, setRecordingMode] = (() => {
        let recording = false;
        return [
            {
                get: () => recording,
                subscribe: (callback) => emitter.on('recording', callback),
            },
            (value) => {
                recording = value;
                emitter.emit('recording');
            },
        ];
    })();
    const [recordingVideo, setRecordingVideo] = (() => {
        let recordingVideo = false;
        return [
            {
                get: () => recordingVideo,
                subscribe: (callback) => emitter.on('recordingVideo', callback),
            },
            (value) => {
                recordingVideo = value;
                emitter.emit('recordingVideo');
            },
        ];
    })();
    const [isMicrophoneDenied, setIsMicrophoneDenied] = (() => {
        let isMicrophoneDenied = false;
        return [
            {
                get: () => isMicrophoneDenied,
                subscribe: (callback) => emitter.on('mircophoneDenied', callback),
            },
            (value) => {
                isMicrophoneDenied = value;
                emitter.emit('mircophoneDenied');
            },
        ];
    })();
    const setEditingMode = (editing) => {
        setEditing(editing);
    };
    const [formatters, stopFormatterTracker] = (() => {
        let actions = [];
        const c = Tracker.autorun(() => {
            actions = messageBoxFormatting_1.formattingButtons.filter(({ condition }) => !condition || condition());
            emitter.emit('formatting');
        });
        return [
            {
                get: () => actions,
                subscribe: (callback) => emitter.on('formatting', callback),
            },
            c,
        ];
    })();
    const release = () => {
        input.removeEventListener('input', persist);
        stopFormatterTracker.stop();
    };
    const wrapSelection = (pattern) => {
        var _a, _b;
        const { selectionEnd = input.value.length, selectionStart = 0 } = input;
        const initText = input.value.slice(0, selectionStart);
        const selectedText = input.value.slice(selectionStart, selectionEnd);
        const finalText = input.value.slice(selectionEnd, input.value.length);
        focus();
        const startPattern = pattern.slice(0, pattern.indexOf('{{text}}'));
        const startPatternFound = [...startPattern].reverse().every((char, index) => input.value.slice(selectionStart - index - 1, 1) === char);
        if (startPatternFound) {
            const endPattern = pattern.slice(pattern.indexOf('{{text}}') + '{{text}}'.length);
            const endPatternFound = [...endPattern].every((char, index) => input.value.slice(selectionEnd + index, 1) === char);
            if (endPatternFound) {
                insertText(selectedText);
                input.selectionStart = selectionStart - startPattern.length;
                input.selectionEnd = selectionEnd + endPattern.length;
                if (!((_a = document.execCommand) === null || _a === void 0 ? void 0 : _a.call(document, 'insertText', false, selectedText))) {
                    input.value = initText.slice(0, initText.length - startPattern.length) + selectedText + finalText.slice(endPattern.length);
                }
                input.selectionStart = selectionStart - startPattern.length;
                input.selectionEnd = input.selectionStart + selectedText.length;
                triggerEvent(input, 'input');
                triggerEvent(input, 'change');
                focus();
                return;
            }
        }
        if (!((_b = document.execCommand) === null || _b === void 0 ? void 0 : _b.call(document, 'insertText', false, pattern.replace('{{text}}', selectedText)))) {
            input.value = initText + pattern.replace('{{text}}', selectedText) + finalText;
        }
        input.selectionStart = selectionStart + pattern.indexOf('{{text}}');
        input.selectionEnd = input.selectionStart + selectedText.length;
        triggerEvent(input, 'input');
        triggerEvent(input, 'change');
        focus();
    };
    const insertNewLine = () => insertText('\n');
    setText((_a = accounts_base_1.Accounts.storageLocation.getItem(storageID)) !== null && _a !== void 0 ? _a : '', {
        skipFocus: true,
    });
    // Gets the text that is connected to the cursor and replaces it with the given text
    const replaceText = (text, selection) => {
        var _a, _b, _c;
        const { selectionStart, selectionEnd } = input;
        // Selects the text that is connected to the cursor
        input.setSelectionRange((_a = selection.start) !== null && _a !== void 0 ? _a : 0, (_b = selection.end) !== null && _b !== void 0 ? _b : text.length);
        const textAreaTxt = input.value;
        if (!((_c = document.execCommand) === null || _c === void 0 ? void 0 : _c.call(document, 'insertText', false, text))) {
            input.value = textAreaTxt.substring(0, selection.start) + text + textAreaTxt.substring(selection.end);
        }
        input.selectionStart = selectionStart + text.length;
        input.selectionEnd = selectionStart + text.length;
        if (selectionStart !== selectionEnd) {
            input.selectionStart = selectionStart;
        }
        triggerEvent(input, 'input');
        triggerEvent(input, 'change');
        focus();
    };
    return {
        replaceText,
        insertNewLine,
        blur: () => input.blur(),
        substring: (start, end) => {
            return input.value.substring(start, end);
        },
        getCursorPosition: () => {
            return input.selectionStart;
        },
        setCursorToEnd: () => {
            input.selectionEnd = input.value.length;
            input.selectionStart = input.selectionEnd;
            focus();
        },
        setCursorToStart: () => {
            input.selectionStart = 0;
            input.selectionEnd = input.selectionStart;
            focus();
        },
        release,
        wrapSelection,
        get text() {
            return input.value;
        },
        get selection() {
            return {
                start: input.selectionStart,
                end: input.selectionEnd,
            };
        },
        editing,
        setEditingMode,
        recording,
        setRecordingMode,
        recordingVideo,
        setRecordingVideo,
        insertText,
        setText,
        clear,
        focus,
        replyWith,
        quoteMessage,
        dismissQuotedMessage,
        dismissAllQuotedMessages,
        quotedMessages,
        formatters,
        isMicrophoneDenied,
        setIsMicrophoneDenied,
    };
};
exports.createComposerAPI = createComposerAPI;
